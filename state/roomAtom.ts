import { atom } from 'jotai';
import { RoomWithQueue } from '../models/Room';

export const ROOM_EMPTY = {
  id: -1,
  name: '',
  slug: '',
  queuedSongs: [],
  owner_id: '',
  users: [],
  messages: [],
  isPublic: true,
  queue: [],
};

export const roomAtom = atom<RoomWithQueue>(ROOM_EMPTY);
