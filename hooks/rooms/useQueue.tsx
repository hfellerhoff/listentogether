import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Room, { Queue } from '../../models/Room';
import { roomAtom } from '../../state/roomAtom';
import useRoomSongs from '../supabase/useRoomSongs';
import useSongs from '../supabase/useSongs';

const useQueue = (roomID: number): Queue => {
  const songs = useSongs(roomID);

  const sortedSongs = songs.array.sort((a, b) => {
    if (a.addedAt <= b.addedAt) return -1;
    else return 1;
  });

  return sortedSongs;
};

export default useQueue;
