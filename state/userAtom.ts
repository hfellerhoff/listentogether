import { atom } from 'jotai';
import Service from '../models/Service';
import User from '../models/User';

export const userAtom = atom<User>({
  service: Service.Spotify,
  id: '',
  profile: {
    name: '',
    image: {
      src: '',
    },
  },
  rooms: {
    current: undefined,
    favorited: [],
    created: [],
  },
});
