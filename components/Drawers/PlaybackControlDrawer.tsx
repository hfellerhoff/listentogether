import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Flex,
  Heading,
  Button,
  Avatar,
  Icon,
  useColorMode,
  Box,
} from '@chakra-ui/core';
import { useRecoilValue, useRecoilState } from 'recoil';
import DashboardSongControls from '../Room/DashboardSongControls';
import VolumeAndDeviceControl from '../Room/VolumeAndDeviceControl';
import { displayedModalState } from '../../state/displayedModal';
import { userInformationState } from '../../state/userInformation';

interface Props {}

const PlaybackControlDrawer = (props: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const userInformation = useRecoilValue(userInformationState);
  const [displayedModal, setDisplayedModal] = useRecoilState(
    displayedModalState
  );

  const onClose = () => setDisplayedModal(null);
  const onSpeakerClick = () => setDisplayedModal('device-select');
  const isOpen = displayedModal === 'playback-control';

  return (
    <Drawer placement='top' onClose={onClose} isOpen={isOpen}>
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
              <Button variant='ghost' rightIcon='chevron-down'>
                <Avatar
                  size='sm'
                  name={userInformation?.displayName || 'Guest User'}
                  src={
                    userInformation
                      ? userInformation.image.src || undefined
                      : undefined
                  }
                />
              </Button>
              <Button variant='ghost' onClick={toggleColorMode}>
                <Icon name={colorMode === 'light' ? 'moon' : 'sun'} />
              </Button>
            </Flex>
            <Heading flex={1} size='md' mt={8} mb={2}>
              Song Playback
            </Heading>
            <DashboardSongControls />
            <Box width={8} />
            <Heading flex={1} size='md' mt={8} mb={2}>
              Volume + Device
            </Heading>
            <VolumeAndDeviceControl onSpeakerClick={onSpeakerClick} />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PlaybackControlDrawer;
