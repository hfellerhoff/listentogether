import { customAlphabet } from 'nanoid';
import { NextApiHandler } from 'next';

import User from '../../../src/models/User';
import supabase from '../../../src/util/supabase/index';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

const handler: NextApiHandler = async (req, res) => {
  const user: User = JSON.parse(req.body);

  const room = {
    name: `${user.name}'s Room`,
    slug: nanoid(),
    isPublic: true,
    owner_id: user.id,
  };

  await supabase
    .from('rooms')
    .insert([room])
    .then((res) => console.log(res));

  res.json(room);
};
export default handler;
