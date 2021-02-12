import Room from './Room';
import User from './User';

export enum MessageType {
  UserChat = 'chat',
  UserJoin = 'join',
  UserLeave = 'leave',
}

interface Message {
  user: User;
  room: Room;
  type: MessageType;
  content: string;
  timestamp: number;
}

export default Message;
