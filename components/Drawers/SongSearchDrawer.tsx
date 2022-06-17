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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Tag,
  useToast,
} from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useSpotifyAuthentication from '../../hooks/spotify/useSpotifyAuthentication';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../../state/spotifyAtom';
import { userAtom } from '../../state/userAtom';
import { Modal, modalAtom } from '../../state/modalAtom';
import Service from '../../models/Service';
import { roomAtom } from '../../state/roomAtom';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { ArrowRightIcon } from '@radix-ui/react-icons';

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
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [youTubeURL, setYouTubeURL] = useState('');
  const [lastSearched, setLastSearched] = useState(0);
  const [searchResults, setSearchResults] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const queueTrack = async ({
    spotifyUri,
    youtubeVideoID,
  }: {
    spotifyUri?: string;
    youtubeVideoID?: string;
  }) => {
    if (user) {
      console.log('Queuing track...');

      const res = await fetch('/api/rooms/queue', {
        method: 'POST',
        body: JSON.stringify({
          roomId: room.id,
          spotifyUri,
          youtubeVideoID,
        }),
      });

      setSearchQuery('');
      setYouTubeURL('');
      setModal(Modal.None);
    }
  };

  const onChangeSpotifySearchQuery = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const onChangeYouTubeURL = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setYouTubeURL(e.target.value);
  };

  const handleYouTubeSubmit = (e) => {
    e.preventDefault();

    if (youTubeURL.includes('youtube') && youTubeURL.includes('v=')) {
      const youtubeVideoID = new URL(youTubeURL).searchParams.get('v');

      queueTrack({ youtubeVideoID });
    } else {
      toast({
        title: 'Incorrect URL',
        description:
          'Something is wrong with the URL you provided. Double-check your URL and try again.',
        status: 'warning',
      });
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
          <Tabs isFitted maxW={800} margin='0 auto'>
            <TabList mb='1em'>
              <Tab gap={1.5}>
                <FaSpotify />
                Spotify
              </Tab>
              <Tab gap={1.5}>
                <FaYoutube />
                YouTube <Tag>Beta</Tag>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex
                  direction='column'
                  align='centre'
                  justify='center'
                  maxW={800}
                  margin='0 auto'
                >
                  <Input
                    size={
                      dimensions ? (dimensions.width > 600 ? 'lg' : 'md') : 'lg'
                    }
                    placeholder='Search for a song to queue...'
                    onChange={onChangeSpotifySearchQuery}
                    value={searchQuery}
                  />
                  <Grid
                    pt={searchResults.length > 0 ? 4 : 0}
                    gridTemplateColumns={[
                      '1fr',
                      '1fr 1fr',
                      '1fr 1fr',
                      '1fr 1fr',
                    ]}
                    gridColumnGap={8}
                  >
                    {searchResults.map((track, index) => {
                      return (
                        <Box
                          {...grayGhostStyle[colorMode]}
                          p={2}
                          mx={-2}
                          borderRadius={4}
                          onClick={() => queueTrack({ spotifyUri: track.uri })}
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
              </TabPanel>
              <TabPanel>
                <form onSubmit={handleYouTubeSubmit}>
                  <Flex justify='center' maxW={800} margin='0 auto'>
                    <Input
                      size={
                        dimensions
                          ? dimensions.width > 600
                            ? 'lg'
                            : 'md'
                          : 'lg'
                      }
                      placeholder='Enter a YouTube video URL...'
                      onChange={onChangeYouTubeURL}
                      value={youTubeURL}
                    />
                    <Button
                      type='submit'
                      ml={4}
                      size='lg'
                      rightIcon={<ArrowRightIcon />}
                    >
                      Queue
                    </Button>
                  </Flex>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SongSearchDrawer;
