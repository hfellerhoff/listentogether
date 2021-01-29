import React from 'react';
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

interface Props {
  placement?: 'top' | 'bottom';
  isHome?: boolean;
}

const PlaybackHeader = ({ placement, isHome }: Props) => {
  placement = placement || 'top';
  const { foregroundColor } = useBackgroundColor();
  const [user] = useAtom(userAtom);
  // const roomInformation = useRecoilValue(roomInformationState);
  const [, setModal] = useAtom(modalAtom);

  return (
    <>
      <Box height={24} display={isHome ? 'static' : 'none'} />
      <Grid
        bg={foregroundColor}
        gridTemplateColumns={[
          '1fr auto',
          '1fr auto',
          '1fr auto',
          '1fr 3fr 1fr',
        ]}
        gridTemplateRows={'1fr'}
        py={2}
        px={[2, 8, 8, 8]}
        boxShadow='0px 5px 5px 0px rgba(0,0, 0, 0.075)'
        zIndex={1}
        width='100vw'
        position='fixed' //placement === 'top' ? 'static' : 'fixed'
        bottom={placement === 'bottom' ? 0 : ''}
        top={placement === 'top' ? 0 : ''}
        height={24}
      >
        <Flex
          display={['none', 'none', 'none', 'flex']}
          align='center'
          justify='center'
        >
          {/* {roomInformation ? (
            <DashboardSongControls />
          ) : ( */}
          <Link href='/rooms/test'>
            <a>
              <Button colorScheme='green' leftIcon={<FiPlus />}>
                Test Room
              </Button>
            </a>
          </Link>
          {/* <Link href='/create'>
            <a>
              <Button colorScheme='green' leftIcon={<FiPlus />}>
                Create Room
              </Button>
            </a>
          </Link> */}
          {/* )} */}
        </Flex>
        <Flex
          p={2}
          borderRadius={4}
          width='100%'
          align='center'
          justify='space-between'
        >
          <PlaybackHeaderSongDisplay />
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
            <Avatar
              size='sm'
              name={user.profile.name}
              src={user.profile.image.src}
            />
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
