import { Avatar, Box, Button, Flex, Grid, Tooltip } from '@chakra-ui/react';
import { FiChevronDown, FiMusic } from 'react-icons/fi';

import { useProfileContext } from 'src/lib/UserProvider';
import useStore, { Modal } from 'src/state/store';

import CreateRoomButton from './CreateRoomButton';
import PlaybackHeaderSongDisplay from './PlaybackHeaderSongDisplay';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import Room from '../../models/Room';
import Song from '../../models/Song';
import ColorModeButton from '../ColorModeButton';
import DashboardSongControls from '../Room/DashboardSongControls';
import VolumeAndDeviceControl from '../Room/VolumeAndDeviceControl';

interface Props {
  placement?: 'top' | 'bottom';
  isHome?: boolean;
  song?: Song;
  room?: Room;
}

const PlaybackHeader = ({ placement, isHome, song, room }: Props) => {
  placement = placement || 'top';

  const { user } = useProfileContext();
  const { handleSetModal } = useStore((store) => ({
    handleSetModal: store.handleSetModal,
  }));
  const { foregroundColor } = useBackgroundColor();

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
          {!room || !room.name ? (
            <CreateRoomButton />
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
              onSpeakerClick={handleSetModal(Modal.DeviceSelect)}
            />
          </Box>
        </Flex>
        <Flex
          align='center'
          justify='center'
          display={['none', 'none', 'none', 'flex']}
        >
          <Button variant='ghost' rightIcon={<FiChevronDown />}>
            <Avatar size='sm' name={user?.name} src={user?.avatarUrl} />
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
            <Button onClick={handleSetModal(Modal.PlaybackControl)}>
              <FiMusic fontSize={20} />
            </Button>
          </Tooltip>
        </Flex>
      </Grid>
    </>
  );
};

export default PlaybackHeader;
