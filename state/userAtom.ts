import { atom } from 'jotai';
import Service from '../models/Service';
import User from '../models/User';

export const userAtom = atom<User>({
  id: '',
  service: Service.Spotify,
  serviceId: '',
  online: false,
  name: '',
  imageSrc: '',
});
