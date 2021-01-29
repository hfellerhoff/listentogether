// import { UserInformationRoom } from './UserInformation';

import User from '../User';

export type ChatMessageType =
  | 'message'
  | 'join'
  | 'leave'
  | 'queue'
  | 'room-create';

export type ChatMessage = {
  type: ChatMessageType;
  content: string;
  user: User;
  timestamp: string;
  //   timestamp: firebase.firestore.FieldValue;
};
