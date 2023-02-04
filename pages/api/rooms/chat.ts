import { NextApiHandler } from 'next';

import { MessageType } from '../../../src/models/Message';
import supabase from '../../../src/util/supabase/index';

const handler: NextApiHandler = async (req, res) => {
  const message_data = JSON.parse(req.body);

  const chat = {
    type: MessageType.UserChat,
    content: message_data.message,
    room_id: message_data.room_id,
    user_id: message_data.user_id,
  };

  await supabase
    .from('messages')
    .insert([chat])
    .then((res) => console.log(res));

  // res.json(room);
  res.end();
};
export default handler;
