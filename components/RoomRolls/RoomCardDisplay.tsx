import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { PseudoBox, Heading, Box, Text, Flex, Tooltip } from '@chakra-ui/core';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { RoomInformation } from '../../models/RoomInformation';
import { FiMusic, FiUser } from 'react-icons/fi';
import useGradientsFromImageRef from '../../hooks/useGradientsFromImage';
import LinesEllipsis from 'react-lines-ellipsis';
import { useRecoilValue } from 'recoil';
import { userInformationState } from '../../state/userInformation';
import { getFullUserID } from '../../util/user';
import { FaCrown } from 'react-icons/fa';
import FavoriteRoomButton from '../Buttons/FavoriteRoomButton';

interface Props {
  room: RoomInformation;
}

const RoomCardDisplay = ({ room }: Props) => {
  const history = useHistory();
  const userInformation = useRecoilValue(userInformationState);

  const image = useRef<HTMLImageElement>();
  const [normalGradient, hoverGradient] = useGradientsFromImageRef(image);

  return (
    <PseudoBox
      borderRadius={4}
      h='100%'
      background={normalGradient}
      p={[4, 6, 8, 8]}
      cursor='pointer'
      _hover={{
        background: hoverGradient,
      }}
      onClick={async () => {
        history.push(`/rooms/${room.id}`);
      }}
      textAlign='center'
      color='#ffffff'
      position='relative'
    >
      <Heading size='lg' textShadow='0px 2px #2F2F2F'>
        <LinesEllipsis
          text={room.name}
          maxLine={2}
          ellipsis='...'
          basedOn='letters'
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </Heading>
      {room.currentSong ? (
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
      )}
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
              {room.count.listeners}
            </Text>
          </Flex>
        </Tooltip>
        {userInformation ? (
          room.owner.id === getFullUserID(userInformation) ? (
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
            <FavoriteRoomButton room={room} colorMode='dark' />
            <Text fontSize={20} ml={2}>
              {room.count.favorites}
            </Text>
          </Flex>
        </Tooltip>
      </Flex>
    </PseudoBox>
  );
};

export default RoomCardDisplay;
