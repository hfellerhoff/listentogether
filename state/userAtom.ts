import { atom } from 'jotai';
import Service from '../models/Service';
import User from '../models/User';

export const userAtom = atom<User>({
  service: Service.Spotify,
  id: '',
  online: false,
  name: '',
  imageSrc: '',
});
