import { useEffect } from 'react';

import { useAtom } from 'jotai';

import Room from '../../models/Room';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

const useMonitorRoom = (slug?: string): Room => {
  const [room, setRoom] = useAtom(roomAtom);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .range(0, 1);
      if (rooms && rooms.length > 0) {
        setRoom({
          ...rooms[0],
        });
      }
    };

    if (slug && room.slug !== slug) fetchRoom();
  }, [room.slug, setRoom, slug]);

  return room;
};

export default useMonitorRoom;
