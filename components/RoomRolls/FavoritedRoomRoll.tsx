import { Spinner } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React from 'react';
import Room from '../../models/Room';
import { userAtom } from '../../state/userAtom';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';

interface Props {
  rooms: Room[] | undefined;
  isLoading?: boolean;
}

const FavoritedRoomRoll = ({ rooms, isLoading }: Props) => {
  const [user] = useAtom(userAtom);

  if (isLoading) return <Spinner size='lg' />;

  const userID = user.id;
  if (user && rooms) {
    // rooms = rooms.filter(
    //   (room) =>
    //     userInformation.favoritedRoomIDs.includes(room.id) ||
    //     (userID ? room.owner.id === userID : false)
    // );
  }

  return (
    <RoomRollLayout>
      {rooms ? (
        rooms.map((room, index) => {
          return <RoomCardDisplay room={room} key={index} />;
        })
      ) : (
        <></>
      )}
    </RoomRollLayout>
  );
};

export default FavoritedRoomRoll;
