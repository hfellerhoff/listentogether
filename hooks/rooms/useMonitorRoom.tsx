import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

interface Props {}

const useMonitorRoom = (slug?: string) => {
  const [room, setRoom] = useAtom(roomAtom);

  useEffect(() => {
    const fetchRoom = async () => {
      let { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .range(0, 1);
      if (rooms && rooms.length > 0) {
        setRoom(rooms[0]);
      }
    };

    if (slug && room.slug !== slug) fetchRoom();
  }, [slug]);

  return room;
};

export default useMonitorRoom;
