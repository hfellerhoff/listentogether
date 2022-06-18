import { useEffect, useState } from 'react';
import Room from '../../models/Room';
import supabase from '../../util/supabase';
import RoomRoll from './RoomRoll';

interface Props {}

const PublicRoomRoll = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      let { data, error } = await supabase
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
        .eq('isPublic', true)
        .limit(30);

      if (!error) {
        const parsedRooms = Object.values(data).map((d) => d.rooms);
        setRooms(parsedRooms);
      } else console.error(error);

      setIsLoading(false);
    };

    fetchRooms();
  }, []);

  return <RoomRoll rooms={rooms} isLoading={isLoading} title='Public Rooms' />;
};

export default PublicRoomRoll;
