import React, { useEffect, useState, useCallback } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Heading,
  DrawerBody,
  Flex,
  Spinner,
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Stack,
  Link,
} from '@chakra-ui/react';
import { FiRefreshCcw } from 'react-icons/fi';
import { useAtom } from 'jotai';
import useSpotifyAuthentication from '../../hooks/spotify/useSpotifyAuthentication';
import RadioCardGroup from '../RadioCardGroup';
import useStore, { Modal } from 'state/store';

interface Props {}

const DeviceSelectDrawer = (props: Props) => {
  const { accessToken } = useSpotifyAuthentication();
  const { spotify, modal, handleSetModal } = useStore((store) => ({
    spotify: store.spotify,
    modal: store.modal,
    handleSetModal: store.handleSetModal,
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [isTransferingPlayback, setIsTransferingPlayback] = useState(false);
  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  const isOpen = modal === Modal.DeviceSelect;

  const getDevices = useCallback(async () => {
    if (accessToken && spotify) {
      setIsLoading(true);
      spotify.setAccessToken(accessToken);
      const devicesResponse = await spotify.getMyDevices();
      setDevices(devicesResponse.devices);
      devicesResponse.devices.forEach((device) => {
        if (device.is_active) setSelectedDevice(device.id as string);
      });
      setIsLoading(false);
    }
  }, [accessToken, spotify]);

  useEffect(() => {
    if (isOpen) getDevices();
  }, [accessToken, getDevices, isOpen, spotify]);

  const updateSelectedDevice = async (device_id: string) => {
    if (spotify) {
      // && device_id !== selectedDevice
      setIsTransferingPlayback(true);
      await spotify
        .transferMyPlayback([device_id])
        .catch((err) => console.error(err));
      console.log('Successfully changed playback to ' + device_id);
      setIsTransferingPlayback(false);
    }
  };

  return (
    <Drawer
      placement='top'
      onClose={handleSetModal(Modal.None)}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent p={[2, 4, 8, 8]}>
        <DrawerHeader>
          <Flex maxW={600} margin='0 auto'>
            <Heading flex={1}>Select Playback Device</Heading>
            <Button onClick={getDevices}>
              <FiRefreshCcw />
            </Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <Flex
            direction='column'
            align='centre'
            justify='center'
            maxW={600}
            margin='0 auto'
          >
            {isLoading ? (
              <Flex align='center' justify='center' p={16}>
                <Spinner size='lg' />
              </Flex>
            ) : devices.length === 0 ? (
              <Alert
                status='info'
                variant='subtle'
                flexDirection='column'
                justifyContent='center'
                textAlign='center'
                height='200px'
                py={4}
                px={8}
              >
                <AlertIcon fontSize={24} mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                  Can't listen together if you have nothing to listen on!
                </AlertTitle>
                <AlertDescription>
                  Looks like you don't have any available devices. Try opening
                  up Spotify on one of your devices, or swap to a browser that
                  supports{' '}
                  <Link
                    fontWeight={600}
                    href='https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Spotify's Web Playback SDK.
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <Box>
                {devices.length > 0 ? (
                  <RadioCardGroup
                    name='deviceSelect'
                    options={devices.map((device) => ({
                      label: device.name,
                      value: device.id,
                      type: device.type,
                      isChecked: device.is_active,
                    }))}
                    onChange={(id) => updateSelectedDevice(id)}
                    isLoading={isTransferingPlayback}
                  />
                ) : (
                  <></>
                )}
                <Box textAlign='center'>
                  <Text maxW='md' margin='0 auto'>
                    Looking for a device that isn't here? Try opening up Spotify
                    on one of your devices, or swap to a browser that supports{' '}
                    <Link
                      fontWeight={600}
                      href='https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Spotify's Web Playback SDK.
                    </Link>
                  </Text>
                </Box>
              </Box>
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DeviceSelectDrawer;
