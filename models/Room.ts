import Message from './Message';
import Song from './Song';
import User from './User';

interface Room {
  id: number;
  name: string;
  slug: string;
  queuedSongs: Song[];
  owner_id: string;
  users: User[];
  messages: Message[];
  isPublic: boolean;
}

export default Room;
