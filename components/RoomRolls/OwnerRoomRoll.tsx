import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Room from '../../models/Room';
import { userAtom } from '../../state/userAtom';
import supabase from '../../util/supabase';
import RoomRoll from './RoomRoll';

interface Props {}

const OwnerRoomRoll = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const fetchRooms = async () => {
      let { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', user.id)
        .order('id');

      if (!error) {
        setRooms(rooms);
      } else console.error(error);

      setIsLoading(false);
    };

    if (user && user.id !== '') fetchRooms();
  }, [user]);

  return <RoomRoll rooms={rooms} isLoading={isLoading} title='Your Rooms' />;
};

export default OwnerRoomRoll;
