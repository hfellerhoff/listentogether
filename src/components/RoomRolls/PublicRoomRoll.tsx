import { useEffect, useState } from 'react';

import RoomRoll from './RoomRoll';
import Room from '../../models/Room';
import supabase from '../../util/supabase';

const PublicRoomRoll = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select(
          `
          room_id,
          rooms (
            id,
            name,
            isPublic,
            slug,
            owner_id
          )
        `
        )
        .order('updatedAt', {
          ascending: false,
        })
        .limit(30);

      if (!error) {
        const parsedRooms = Object.values(data).map((d) => d.rooms);
        if (!parsedRooms) return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setRooms(parsedRooms);
      } else console.error(error);

      setIsLoading(false);
    };

    fetchRooms();
  }, []);

  return <RoomRoll rooms={rooms} isLoading={isLoading} title='Public Rooms' />;
};

export default PublicRoomRoll;
