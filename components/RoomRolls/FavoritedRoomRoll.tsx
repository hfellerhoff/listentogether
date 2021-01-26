import React from 'react';
import { RoomInformation } from '../../models/RoomInformation';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';
import { useRecoilValue } from 'recoil';
import { userInformationState } from '../../state/userInformation';
import Loading from '../Loading';
import { getFullUserID } from '../../util/user';

interface Props {
  rooms: RoomInformation[] | undefined;
  isLoading?: boolean;
}

const FavoritedRoomRoll = ({ rooms, isLoading }: Props) => {
  const userInformation = useRecoilValue(userInformationState);

  if (isLoading) return <Loading size='lg' />;

  const userID = userInformation ? getFullUserID(userInformation) : null;
  if (userInformation && rooms) {
    rooms = rooms.filter(
      (room) =>
        userInformation.favoritedRoomIDs.includes(room.id) ||
        (userID ? room.owner.id === userID : false)
    );
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
