import React, { useRef } from 'react';
import { Heading, Box, Text, Flex, Tooltip } from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { FiMusic, FiUser } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import Room from '../../models/Room';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/userAtom';

interface Props {
  room: Room;
}

const RoomCardDisplay = ({ room }: Props) => {
  // const history = useHistory();
  const [user] = useAtom(userAtom);

  const image = useRef<HTMLImageElement>();
  // const [normalGradient, hoverGradient] = useGradientsFromImageRef(image);

  return (
    <Box
      borderRadius={4}
      h='100%'
      // background={normalGradient}
      p={[4, 6, 8, 8]}
      cursor='pointer'
      // _hover={{
      //   background: hoverGradient,
      // }}
      // onClick={async () => {
      //   history.push(`/rooms/${room.id}`);
      // }}
      textAlign='center'
      color='#ffffff'
      position='relative'
    >
      <Heading size='lg' textShadow='0px 2px #2F2F2F'>
        <Text>{room.name}</Text>
      </Heading>
      {/* {room.currentSong ? (
        <Box mt={4}>
          <DashboardSongDisplay
            title={room.currentSong.name}
            artist={room.currentSong.artists[0]}
            album={room.currentSong.album.name}
            src={room.currentSong.album.image.src}
            standalone
            imageRef={image}
          />
        </Box>
      ) : (
        <Box mt={4}>
          <Flex align='center' justify='center' p={12}>
            <FiMusic fontSize={48} />
          </Flex>
          <Text>Be the first to play something!</Text>
        </Box>
      )} */}
      <Box height={12} />
      <Flex
        align='center'
        justify='center'
        position='absolute'
        bottom={6}
        left={0}
        width='100%'
      >
        <Tooltip
          label='Current listeners'
          aria-label='Current listeners'
          placement='top'
        >
          <Flex align='center' justify='center' flex={1}>
            <FiUser fontSize={20} />
            <Text fontSize={20} ml={2}>
              {/* {room.count.listeners} */}
            </Text>
          </Flex>
        </Tooltip>
        {user ? (
          room.owner.id === user.id ? (
            <Tooltip label='Your room' aria-label='Your room' placement='top'>
              <Flex align='center' justify='center' mx={2}>
                <FaCrown fontSize={24} />
              </Flex>
            </Tooltip>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        <Tooltip label='Favorites' aria-label='Favorites' placement='top'>
          <Flex align='center' justify='center' flex={1}>
            {/* <FavoriteRoomButton room={room} colorMode='dark' />
            <Text fontSize={20} ml={2}>
              {room.count.favorites}
            </Text> */}
          </Flex>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default RoomCardDisplay;
