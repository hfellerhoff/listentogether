import { useEffect, useState } from 'react';

import RoomRoll from './RoomRoll';
import Room from '../../models/Room';
import supabase from '../../util/supabase';
import { usePlatformUserContext } from '@/lib/UserProvider';

const OwnerRoomRoll = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  const { user } = usePlatformUserContext();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user?.name) return;

      const { data: legacyUsers } = await supabase
        .from('users')
        .select('id')
        .eq('name', user?.name);
      if (!legacyUsers?.length) return;
      const legacyUserId = legacyUsers[0].id;

      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', legacyUserId)
        .order('id');

      if (!error) {
        setRooms(rooms);
      } else console.error(error);

      setIsLoading(false);
    };

    fetchRooms();
  }, [user?.name]);

  return <RoomRoll rooms={rooms} isLoading={isLoading} title='Your Rooms' />;
};

export default OwnerRoomRoll;
