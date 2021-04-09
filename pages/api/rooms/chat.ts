
const redirectURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/rooms/'
    : 'http://listentogether.app/rooms/';

import Room from '../../../models/Room';
import User from '../../../models/User';
import supabase from '../../../util/supabase/index';
import {MessageType} from '../../../models/Message';


export default function handler(req, res) {
  const message_data = JSON.parse(req.body);

  const chat = {
    type: MessageType.UserChat,
    content: message_data.message
  };

  supabase
    .from('messages')
    .insert([chat])
    .then((res) => {
      const entry = {
        message_id: res.data[0].id,
        room_id: message_data.room_id,
        user_id: message_data.user_id
      }
      supabase
        .from('room_user_messages')
        .insert([entry])
        .then((res1) => console.log(res1)) 
    });


  // res.json(room);
  res.end();
}
