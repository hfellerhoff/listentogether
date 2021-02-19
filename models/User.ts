import Room from './Room';
import Service from './Service';

interface User {
  id: string;
  service: Service;
  serviceId: string;
  online: boolean;
  name: string;
  imageSrc: string;
  // favoritedRooms: Room[];
}

export default User;
