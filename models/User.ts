import Room from './Room';
import Service from './Service';

interface User {
  id: string;
  service: Service;
  online: boolean;
  profile: {
    name: string;
    image: {
      src: string;
    };
  };
  rooms: {
    current: Room | undefined;
    favorited: Room[];
  };
}

export default User;
