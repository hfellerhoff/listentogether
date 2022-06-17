import { atom } from 'jotai';
import Song from '../models/Song';

type ActiveSong = Song & {
  duration_ms: number;
};

const EMPTY: ActiveSong = {
  id: 0,
  progress: 0,
  updatedAt: '',
  addedAt: '',
  isPaused: false,
  room_id: 0,
  duration_ms: 1,
};

export const activeSongAtom = atom<ActiveSong>(EMPTY);
