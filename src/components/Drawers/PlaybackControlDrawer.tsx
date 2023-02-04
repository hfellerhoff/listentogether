import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Flex,
  Heading,
  Button,
  Avatar,
  Box,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

import { usePlatformUserContext } from 'src/lib/UserProvider';
import useStore, { Modal } from 'src/state/store';

import ColorModeButton from '../ColorModeButton';
import DashboardSongControls from '../Room/DashboardSongControls';
import VolumeAndDeviceControl from '../Room/VolumeAndDeviceControl';

const PlaybackControlDrawer = () => {
  const { user } = usePlatformUserContext();
  const { modal, handleSetModal } = useStore((store) => ({
    modal: store.modal,
    handleSetModal: store.handleSetModal,
  }));

  const isOpen = modal === Modal.PlaybackControl;

  return (
    <Drawer
      placement='top'
      onClose={handleSetModal(Modal.None)}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent p={[2, 4, 8, 8]}>
        <DrawerBody>
          <Flex
            direction='column'
            align='center'
            justify='center'
            maxW={600}
            margin='0 auto'
          >
            <Heading flex={1} size='md' mb={2}>
              User + Appearance
            </Heading>
            <Flex>
              <Button variant='ghost' rightIcon={<FaChevronDown />}>
                <Avatar
                  size='sm'
                  name={user?.name || 'Guest User'}
                  src={user ? user.profilePhoto || undefined : undefined}
                />
              </Button>
              <ColorModeButton />
            </Flex>
            <Heading flex={1} size='md' mt={8} mb={2}>
              Song Playback
            </Heading>
            <DashboardSongControls />
            <Box width={8} />
            <Heading flex={1} size='md' mt={8} mb={2}>
              Volume + Device
            </Heading>
            <VolumeAndDeviceControl
              onSpeakerClick={handleSetModal(Modal.PlaybackControl)}
            />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PlaybackControlDrawer;
