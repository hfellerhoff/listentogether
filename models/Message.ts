import User from './User';

export enum MessageType {
  UserChat = 'chat',
  UserJoin = 'join',
  UserLeave = 'leave',
}

interface Message {
  user: User;
  type: MessageType;
  content: string;
  timestamp: number;
}

export default Message;
