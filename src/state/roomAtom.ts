import { atom } from 'jotai';

import Room from '../models/Room';

export const ROOM_EMPTY: Room = {
  id: -1,
  name: '',
  slug: '',
  queuedSongs: [],
  owner_id: '',
  users: [],
  messages: [],
  isPublic: true,
  visibility: 'public',
};

export const roomAtom = atom<Room>(ROOM_EMPTY);
