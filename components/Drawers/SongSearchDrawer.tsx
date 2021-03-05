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
  Grid,
  Box,
} from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useSpotifyAuthentication from '../../hooks/useSpotifyAuthentication';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../../state/spotifyAtom';
import { userAtom } from '../../state/userAtom';
import { Modal, modalAtom } from '../../state/modalAtom';
import Service from '../../models/Service';
import { roomAtom } from '../../state/roomAtom';

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

  const [spotifyAPI] = useAtom(spotifyAtom);
  const [user] = useAtom(userAtom);
  const [room] = useAtom(roomAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const { accessToken } = useSpotifyAuthentication();

  // const roomInformation = useRecoilValue(roomInformationState);

  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearched, setLastSearched] = useState(0);
  const [searchResults, setSearchResults] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const queueTrack = async (track: SpotifyApi.TrackObjectFull) => {
    if (spotifyAPI && user) {
      spotifyAPI.setAccessToken(accessToken);

      const res = await fetch('/api/rooms/queue', {
        method: 'POST',
        body: JSON.stringify({
          spotifyUri: track.uri,
          roomId: room.id,
        }),
      });

      setSearchQuery('');
      setModal(Modal.None);
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onClose = () => setModal(Modal.None);
  const isOpen = modal === Modal.QueueSong;

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
                  <Box
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
                  </Box>
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
