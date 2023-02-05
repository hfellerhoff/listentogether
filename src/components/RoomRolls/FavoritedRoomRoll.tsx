import { Spinner } from '@chakra-ui/react';

import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';
import Room from '../../models/Room';

interface Props {
  rooms: Room[] | undefined;
  isLoading?: boolean;
}

const FavoritedRoomRoll = ({ rooms, isLoading }: Props) => {
  if (isLoading) return <Spinner size='lg' />;

  // if (userID && rooms) {
  // rooms = rooms.filter(
  //   (room) =>
  //     userInformation.favoritedRoomIDs.includes(room.id) ||
  //     (userID ? room.owner.id === userID : false)
  // );
  // }

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
