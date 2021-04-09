
const redirectURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/rooms/'
    : 'http://listentogether.app/rooms/';

import Room from '../../../models/Room';
import User from '../../../models/User';
import supabase from '../../../util/supabase/index';
import {MessageType} from '../../../models/Message';


export default function handler(req, res) {
  const message_text: User = JSON.parse(req.body).message;

  const chat = {
    type: MessageType.UserChat,
    content: message_text
  };

  supabase
    .from('messages')
    .insert([chat])
    .then((res) => console.log(res));

  // res.json(room);
  res.end();
}
