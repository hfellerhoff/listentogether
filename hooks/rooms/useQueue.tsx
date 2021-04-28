import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Room, { Queue } from '../../models/Room';
import { roomAtom } from '../../state/roomAtom';
import useRoomSongs from '../supabase/useRoomSongs';
import useSongs from '../supabase/useSongs';

const useQueue = (roomID: number): Queue => {
  const [queue, setQueue] = useState<Queue>([]);

  const songs = useSongs(roomID);

  useEffect(() => {
    setQueue(songs.array);
  }, [songs]);

  return queue;
};

export default useQueue;
