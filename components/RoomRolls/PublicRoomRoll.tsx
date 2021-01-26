import React from 'react';
import { RoomInformation } from '../../models/RoomInformation';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';
import Loading from '../Loading';

interface Props {
  rooms: RoomInformation[] | undefined;
  isLoading?: boolean;
}

const PublicRoomRoll = ({ rooms, isLoading }: Props) => {
  rooms = rooms ? rooms.filter((room) => room.isPublic) : [];

  if (isLoading) return <Loading size='lg' />;

  return (
    <RoomRollLayout>
      {rooms.map((room, index) => {
        return <RoomCardDisplay room={room} key={index} />;
      })}
    </RoomRollLayout>
  );
};

export default PublicRoomRoll;
