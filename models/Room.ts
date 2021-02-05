import Message from './Message';
import Song from './Song';
import User from './User';

interface Room {
  admins: User[];
  users: User[];
  songs: {
    current: Song;
    queue: Song[];
  };
  messages: Message[];
}

export default Room;
