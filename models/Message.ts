import Room from './Room';
import User from './User';

export enum MessageType {
  UserChat = 'chat',
  UserJoin = 'join',
  UserLeave = 'leave',
}

interface Message {
  id: number;
  type: MessageType;
  content: string;
  timestamp: string;
  user_id: number;
  message_id: number;
}

export default Message;
