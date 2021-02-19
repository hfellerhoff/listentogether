const redirectURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/rooms/'
    : 'http://listentogether.app/rooms/';

import { customAlphabet } from 'nanoid';
import Room from '../../../models/Room';
import User from '../../../models/User';
import supabase from '../../../util/supabase/index';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

export default function handler(req, res) {
  const user: User = JSON.parse(req.body);

  const room = {
    name: `${user.name}'s Room`,
    slug: nanoid(),
    isPublic: true,
    owner_id: user.id,
  };

  supabase
    .from('rooms')
    .insert([room])
    .then((res) => console.log(res));

  res.json(room);
}
