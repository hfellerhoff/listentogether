import { Spinner } from '@chakra-ui/react';
import { styled } from '@stitches/react';
import Room from '../../models/Room';
import RoomCardDisplay from './RoomCardDisplay';
import RoomRollLayout from './RoomRollLayout';

interface Props {
  rooms: Room[];
  isLoading?: boolean;
  title?: string;
}

const SectionTitle = styled('h2', {
  color: '$neutral12',
  fontSize: '2rem',
  fontWeight: '700',
  marginTop: '4rem',
  marginBottom: '-0.5rem',
  textAlign: 'left',
  width: '100%',
});

const RoomRoll = ({ isLoading, rooms, title }: Props) => {
  if (isLoading) return <></>;

  return (
    <>
      {title && <SectionTitle>{title}</SectionTitle>}
      <RoomRollLayout>
        {rooms.map((room, index) => {
          return <RoomCardDisplay room={room} key={index} />;
        })}
      </RoomRollLayout>
    </>
  );
};

export default RoomRoll;
