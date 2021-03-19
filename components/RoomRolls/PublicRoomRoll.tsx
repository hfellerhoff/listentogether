import { Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Room from '../../models/Room';
import supabase from '../../util/supabase';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';

interface Props {
  // rooms: Room[] | undefined;
  // isLoading?: boolean;
}

const PublicRoomRoll = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      let { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('isPublic', true);

      if (!error) {
        setRooms(rooms);
      } else console.error(error);

      setIsLoading(false);
    };

    fetchRooms();
  }, []);

  // rooms = rooms ? rooms.filter((room) => room.isPublic) : [];

  if (isLoading) return <Spinner size='lg' />;

  return (
    <RoomRollLayout>
      {rooms.map((room, index) => {
        return <RoomCardDisplay room={room} key={index} />;
      })}
    </RoomRollLayout>
  );
};

export default PublicRoomRoll;
