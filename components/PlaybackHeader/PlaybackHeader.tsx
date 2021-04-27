import React, { useState } from 'react';
import { Grid, Box, Flex, Button, Avatar, Tooltip } from '@chakra-ui/react';
import DashboardSongControls from '../Room/DashboardSongControls';
import VolumeAndDeviceControl from '../Room/VolumeAndDeviceControl';
import { FiChevronDown, FiMusic, FiPlus } from 'react-icons/fi';
import PlaybackHeaderSongDisplay from './PlaybackHeaderSongDisplay';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { userAtom } from '../../state/userAtom';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import Link from 'next/link';
import ColorModeButton from '../ColorModeButton';
import Room, { Queue } from '../../models/Room';
import { useRouter } from 'next/router';
import { roomAtom } from '../../state/roomAtom';
import Song from '../../models/Song';

interface Props {
  placement?: 'top' | 'bottom';
  isHome?: boolean;
  queue: Queue;
  room: Room;
}

const PlaybackHeader = ({ placement, isHome, queue, room }: Props) => {
  placement = placement || 'top';
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [, setModal] = useAtom(modalAtom);
  const { foregroundColor } = useBackgroundColor();

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const song = queue[0] || undefined;

  const onRoomCreate = async () => {
    setIsCreatingRoom(true);
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      body: JSON.stringify(user),
    });

    const room: Room = await res.json();

    router.push(`/rooms/${room.slug}`);
    setIsCreatingRoom(false);
  };

  return (
    <>
      <Box height={24} display={isHome ? 'static' : 'none'} />
      <Grid
        bg={foregroundColor}
        gridTemplateColumns={[
          '1fr auto',
          '1fr auto',
          '2fr 4fr 1fr',
          '1fr 3fr 1fr',
        ]}
        gridTemplateRows={'1fr'}
        py={2}
        px={[2, 8, 8, 8]}
        boxShadow='0px 5px 5px 0px rgba(0,0, 0, 0.075)'
        zIndex={1}
        width='100vw'
        position='fixed'
        bottom={placement === 'bottom' ? 0 : ''}
        top={placement === 'top' ? 0 : ''}
        height={24}
      >
        <Flex
          display={['none', 'none', 'flex', 'flex']}
          align='center'
          justify='center'
        >
          {!room.name ? (
            <Button
              colorScheme='green'
              leftIcon={<FiPlus />}
              onClick={onRoomCreate}
              isLoading={isCreatingRoom}
            >
              Create Room
            </Button>
          ) : (
            <DashboardSongControls song={song} />
          )}
        </Flex>
        <Flex
          p={2}
          borderRadius={4}
          width='100%'
          align='center'
          justify='space-between'
        >
          <PlaybackHeaderSongDisplay song={song} room={room} />
          <Box display={['none', 'none', 'none', 'block']}>
            <VolumeAndDeviceControl
              onSpeakerClick={() => setModal(Modal.DeviceSelect)}
            />
          </Box>
        </Flex>
        <Flex
          align='center'
          justify='center'
          display={['none', 'none', 'none', 'flex']}
        >
          <Button variant='ghost' rightIcon={<FiChevronDown />}>
            <Avatar size='sm' name={user.name} src={user.imageSrc} />
          </Button>
          <ColorModeButton />
        </Flex>
        <Flex
          align='center'
          justify='center'
          display={['flex', 'flex', 'flex', 'none']}
        >
          <Tooltip
            label='Options and Playback'
            aria-label='Options and Playback'
            zIndex={2}
            hasArrow
            placement='bottom-end'
          >
            <Button onClick={() => setModal(Modal.PlaybackControl)}>
              <FiMusic fontSize={20} />
            </Button>
          </Tooltip>
        </Flex>
      </Grid>
    </>
  );
};

export default PlaybackHeader;
