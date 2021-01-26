import React, { useState } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Flex,
  Input,
  DrawerHeader,
  Heading,
  useColorMode,
  PseudoBox,
  Grid,
} from '@chakra-ui/core';
import { useRecoilValue, useRecoilState } from 'recoil';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { displayedModalState } from '../../state/displayedModal';
import firebase from '../../lib/firebase';
import Events from '../../services/analytics/Events';
import { roomInformationState } from '../../state/roomInformation';
import queueSong from '../../services/queueSong';
import { SongInformation } from '../../models/SongInformation';
import { Service } from '../../models/Service';
import { spotifyApiState } from '../../state/spotifyAPI';
import { accessTokenState } from '../../state/accessToken';
import { userInformationState } from '../../state/userInformation';

interface Props {}

const grayGhostStyle = {
  light: {
    color: 'inherit',
    _hover: {
      bg: 'gray.100',
    },
    _active: {
      bg: 'gray.200',
    },
  },
  dark: {
    color: 'whiteAlpha.900',
    _hover: {
      bg: 'whiteAlpha.200',
    },
    _active: {
      bg: 'whiteAlpha.300',
    },
  },
};

const SongSearchDrawer = (props: Props) => {
  const { colorMode } = useColorMode();
  const dimensions = useWindowDimensions();

  const spotifyAPI = useRecoilValue(spotifyApiState);
  const accessToken = useRecoilValue(accessTokenState);
  const userInformation = useRecoilValue(userInformationState);
  const roomInformation = useRecoilValue(roomInformationState);
  const [displayedModal, setDisplayedModal] = useRecoilState(
    displayedModalState
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearched, setLastSearched] = useState(0);
  const [searchResults, setSearchResults] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const queueTrack = async (track: SpotifyApi.TrackObjectFull) => {
    if (spotifyAPI && userInformation) {
      spotifyAPI.setAccessToken(accessToken);
      const devicesResponse = await spotifyAPI.getMyDevices();
      console.log(devicesResponse);

      const userRoom = {
        service: 'spotify' as Service,
        id: userInformation.id,
        displayName: userInformation.displayName,
        image: {
          src: userInformation.image.src,
        },
      };

      const song: SongInformation = {
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        timestampUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        isPlaying: true,
        progress: 0,
        duration: track.duration_ms,
        album: {
          name: track.album.name,
          image: {
            src: track.album.images[0].url,
          },
        },
        spotify: {
          id: track.id,
          uri: track.uri,
        },
        userWhoQueued: userRoom,
      };

      if (roomInformation && userInformation) {
        queueSong(roomInformation, song);
      }

      if (devicesResponse.devices.length === 0) {
        setDisplayedModal('device-select');
        return;
      }

      // await spotifyAPI.play({
      //   uris: [track.uri],
      //   device_id: devicesResponse.devices[0].id || '',
      // });

      firebase.analytics().logEvent(Events.QueueSong, {
        spotify: {
          uri: track.uri,
          id: track.id,
          name: track.name,
        },
      });
      setSearchQuery('');
      setDisplayedModal(null);
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
      return;
    }
    if (spotifyAPI && Date.now() - lastSearched > 250) {
      try {
        setLastSearched(Date.now());
        spotifyAPI.setAccessToken(accessToken);
        const results = await spotifyAPI.searchTracks(e.target.value);
        setSearchResults(results.tracks.items.slice(0, 10));
        console.log(results);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onClose = () => setDisplayedModal(null);
  const isOpen = displayedModal === 'queue-song';

  return (
    <Drawer placement='top' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent p={[2, 4, 8, 8]}>
        <DrawerHeader>
          <Heading
            size={dimensions ? (dimensions.width > 600 ? 'xl' : 'md') : 'xl'}
            maxW={800}
            margin='0 auto'
          >
            Queue a Song
          </Heading>
        </DrawerHeader>
        <DrawerBody>
          <Flex
            direction='column'
            align='centre'
            justify='center'
            maxW={800}
            margin='0 auto'
          >
            <Input
              size={dimensions ? (dimensions.width > 600 ? 'lg' : 'md') : 'lg'}
              placeholder='Search for a song to queue...'
              onChange={onChange}
              value={searchQuery}
            />
            <Grid
              pt={searchResults.length > 0 ? 4 : 0}
              gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr']}
              gridColumnGap={8}
            >
              {searchResults.map((track, index) => {
                return (
                  <PseudoBox
                    {...grayGhostStyle[colorMode]}
                    p={2}
                    mx={-2}
                    borderRadius={4}
                    onClick={() => queueTrack(track)}
                    cursor='pointer'
                    key={index}
                  >
                    <DashboardSongDisplay
                      title={track.name}
                      album={track.album.name}
                      artist={track.artists[0].name}
                      src={
                        track.album.images
                          ? track.album.images[0].url
                          : undefined
                      }
                    />
                  </PseudoBox>
                );
              })}
            </Grid>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SongSearchDrawer;
