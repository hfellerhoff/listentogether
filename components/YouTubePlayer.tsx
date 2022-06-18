import { Box, Button, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { sidepanelAtom } from 'state/sidepanelAtom';
import { useAtom } from 'jotai';
import useWindowDimensions from 'hooks/useWindowDimensions';
import Song from 'models/Song';
import useStore from 'state/store';

type Props = {
  song: Song;
  hideCursor: boolean;
  hasAllowedAutoPlay: boolean;
};

const YouTubePlayer = ({ song, hideCursor, hasAllowedAutoPlay }: Props) => {
  const videoRef = useRef<YouTube>();
  const [isReady, setIsReady] = useState(false);
  const [sidepanelStatus] = useAtom(sidepanelAtom);
  const { width, height } = useWindowDimensions();
  const { setYouTube } = useStore((store) => ({
    youtube: store.youtube,
    setYouTube: store.setYouTube,
  }));

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setIsReady(true);
  };

  useEffect(() => {
    if (videoRef.current && videoRef.current.internalPlayer) {
      setYouTube(videoRef.current.internalPlayer);
    }

    return () => {
      setYouTube(null);
    };
  }, [videoRef.current]);

  // const canPlayVideo = !!videoRef.current && isReady && hasAllowedAutoPlay;

  const opts = {
    width: sidepanelStatus.isRightOpen ? width - 28 * 16 : width,
    height: height,
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
    },
  };

  return (
    <Box
      position='absolute'
      inset={0}
      bg='black'
      cursor={hideCursor ? 'none' : 'inherit'}
    >
      {!hasAllowedAutoPlay && (
        <Center position='absolute' zIndex='modal' inset={0}>
          <Box bg='gray.800' p={4} borderRadius='md'>
            <Button variant='solid'>Start Listening</Button>
          </Box>
        </Center>
      )}
      <YouTube
        id='youtube-player'
        ref={videoRef}
        videoId={song.youtube_video_id}
        title='YouTube video player'
        onReady={onPlayerReady}
        opts={opts}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
        }}
      ></YouTube>
    </Box>
  );
};

export default YouTubePlayer;
