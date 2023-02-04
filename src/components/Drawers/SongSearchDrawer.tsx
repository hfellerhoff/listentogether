import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { FaSpotify, FaYoutube } from 'react-icons/fa';

import { QueueProps } from 'pages/api/rooms/queue';
import YouTubePlayerPreview from 'src/components/YouTubePlayerPreview';
import useStore, { Modal } from 'src/state/store';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import { roomAtom } from '../../state/roomAtom';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { useAuthContext } from '@/lib/AuthProvider';

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

const SongSearchDrawer = () => {
  const { colorMode } = useColorMode();
  const dimensions = useWindowDimensions();

  const [room] = useAtom(roomAtom);
  const { spotify, modal, setModal, handleSetModal } = useStore((store) => ({
    spotify: store.spotify,
    modal: store.modal,
    setModal: store.setModal,
    handleSetModal: store.handleSetModal,
  }));
  const { session } = useAuthContext();

  const toast = useToast();

  // SPOTIFY
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearched, setLastSearched] = useState(0);

  // YOUTUBE
  const [youTubeURL, setYouTubeURL] = useState('');
  const [youTubeDurationMS, setYouTubeDurationMS] = useState(0);

  const [searchResults, setSearchResults] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const queueTrack = async ({
    duration_ms,
    spotifyUri,
    youtubeVideoID,
    progress,
  }: {
    duration_ms: number;
    spotifyUri?: string;
    youtubeVideoID?: string;
    progress?: number;
  }) => {
    console.log('Queuing track...');

    await fetch('/api/rooms/queue', {
      method: 'POST',
      body: JSON.stringify({
        roomId: room.id,
        spotifyUri,
        youtubeVideoID,
        progress,
        duration_ms,
      } as QueueProps),
    }).catch(console.error);

    setSearchQuery('');
    setYouTubeURL('');
    setModal(Modal.None);
  };

  const onChangeSpotifySearchQuery = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '' || !session?.provider_token) {
      setSearchResults([]);
      return;
    }
    if (spotify && Date.now() - lastSearched > 250) {
      try {
        setLastSearched(Date.now());
        spotify.setAccessToken(session?.provider_token);
        const results = await spotify.searchTracks(e.target.value);
        setSearchResults(results.tracks.items.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChangeYouTubeURL = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setYouTubeURL(e.target.value);
  };

  const handleSpotifyQueue =
    (track: SpotifyApi.TrackObjectFull) => async () => {
      await queueTrack({
        spotifyUri: track.uri,
        duration_ms: track.duration_ms,
      });
    };

  const handleYouTubeQueue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      youTubeURL.includes('youtube') &&
      youTubeURL.includes('v=') &&
      youTubeDurationMS
    ) {
      const params = new URL(youTubeURL).searchParams;
      const youtubeVideoID = params.get('v');

      if (
        !youtubeVideoID &&
        !youtubeVideoID?.match(/[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/)
      ) {
        toast({
          title: 'Incorrect URL',
          description:
            'Something is wrong with the URL you provided. Double-check your URL and try again.',
          status: 'warning',
        });
        return;
      }

      const tParam = params.get('t');
      const progress = tParam ? parseInt(tParam.replace('s', '')) * 1000 : 0;

      queueTrack({ youtubeVideoID, progress, duration_ms: youTubeDurationMS });
    } else {
      toast({
        title: 'Incorrect URL',
        description:
          'Something is wrong with the URL you provided. Double-check your URL and try again.',
        status: 'warning',
      });
    }
  };

  const isOpen = modal === Modal.QueueSong;

  const videoID = useMemo(() => {
    if (youTubeURL.includes('youtube') && youTubeURL.includes('v=')) {
      const params = new URL(youTubeURL).searchParams;
      const youtubeVideoID = params.get('v');

      if (!youtubeVideoID?.match(/[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/)) {
        return null;
      }

      // const tParam = params.get('t');
      // const progress = tParam ? parseInt(tParam.replace('s', '')) * 1000 : 0;

      setYouTubeDurationMS(0);
      return youtubeVideoID;
    }

    return null;
  }, [youTubeURL]);

  return (
    <Drawer
      placement='top'
      onClose={handleSetModal(Modal.None)}
      isOpen={isOpen}
    >
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
                          onClick={handleSpotifyQueue(track)}
                          cursor='pointer'
                          key={index}
                        >
                          <DashboardSongDisplay
                            title={track.name}
                            album={track.album.name}
                            artist={track.artists[0].name}
                            src={
                              track.album.images
                                ? track.album.images[0]?.url || undefined
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
                <form onSubmit={handleYouTubeQueue}>
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
                      isLoading={!!videoID && !youTubeDurationMS}
                      isDisabled={!videoID || !youTubeDurationMS}
                    >
                      Queue
                    </Button>
                  </Flex>
                </form>
                {videoID && (
                  <Center mt={8}>
                    <YouTubePlayerPreview
                      videoID={videoID}
                      onGetDurationMS={(duration) =>
                        setYouTubeDurationMS(duration)
                      }
                    />
                  </Center>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SongSearchDrawer;
