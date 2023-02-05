import { useEffect, useState } from 'react';

import { useAuthContext } from '@/lib/AuthProvider';

import RoomRoll from './RoomRoll';
import Room from '../../models/Room';
import supabase from '../../util/supabase';

const OwnerRoomRoll = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  const { session } = useAuthContext();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!session) return;

      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('creator_id', session.user.id)
        .order('id');

      if (!error) {
        setRooms(rooms);
      } else console.error(error);

      setIsLoading(false);
    };

    fetchRooms();
  }, [session]);

  if (!rooms.length) return <></>;
  return <RoomRoll rooms={rooms} isLoading={isLoading} title='Your Rooms' />;
};

export default OwnerRoomRoll;
