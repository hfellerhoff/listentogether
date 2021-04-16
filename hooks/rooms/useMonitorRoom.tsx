import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';
import useQueue from './useQueue';

interface Props {}

const useMonitorRoom = (slug?: string) => {
  const [room, setRoom] = useAtom(roomAtom);
  const queue = useQueue(room);

  useEffect(() => {
    const fetchRoom = async () => {
      let { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .range(0, 1);
      if (rooms && rooms.length > 0) {
        setRoom({
          ...rooms[0],
          queue,
        });
      }
    };

    if (slug && room.slug !== slug) fetchRoom();
  }, [slug]);

  useEffect(() => {
    if (queue)
      setRoom({
        ...room,
        queue,
      });
  }, [queue]);

  return room;
};

export default useMonitorRoom;
