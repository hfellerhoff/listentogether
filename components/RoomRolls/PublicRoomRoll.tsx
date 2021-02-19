import { Spinner } from '@chakra-ui/react';
import React from 'react';
import Room from '../../models/Room';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';

interface Props {
  rooms: Room[] | undefined;
  isLoading?: boolean;
}

const PublicRoomRoll = ({ rooms, isLoading }: Props) => {
  rooms = rooms ? rooms.filter((room) => room.isPublic) : [];

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
