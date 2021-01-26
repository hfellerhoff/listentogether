import Service from './Service';

interface User {
  id: string;
  service: Service;
  profile: {
    name: string;
    image: {
      src: string;
    };
  };
  rooms: {
    current: any;
    favorited: any[];
    created: any[];
  };
}

export default User;
