import ChatComponent from '../../components/Room/Chat/ChatComponent';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Head from 'next/head';
import useMonitorRoom from '../../hooks/rooms/useMonitorRoom';
import useSpotifyHandlePlayback from '../../hooks/spotify/useSpotifyHandlePlayback';
import useQueue from '../../hooks/rooms/useQueue';
import useGradientsFromImageRef from '../../hooks/useGradientsFromImageRef';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import { css, styled } from '@stitches/react';
import FixedButtons from '../../components/Room/FixedButtons';
import Song from '../../models/Song';
import FixedPlaybackButtons from '../../components/Room/FixedPlaybackButtons';
import { sidepanelAtom } from '../../state/sidepanelAtom';
import { neutral } from '../../stitches.config';
import { isLoggedInAtom } from '../../state/userAtom';
import { Button } from '@chakra-ui/react';
import { BASE_URL } from '../../constants/API_SPOTIFY_AUTH';
import { FaSpotify } from 'react-icons/fa';
import YouTubePlayer from 'components/YouTubePlayer';
import useIsInactive from 'hooks/useIsInactive';
import useHasAllowedAutoPlay from 'hooks/useHasAllowedAutoPlay';
import { useEffect } from 'react';
import useSpotifyWebPlayback from 'hooks/spotify/useSpotifyWebPlayback';
import Script from 'next/script';

interface Props {}

const PageLayout = styled('div', {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  display: 'flex',
});

const AlbumBackground = styled('div', {
  height: '100vh',
  width: '100%',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: `linear-gradient(to bottom right, ${neutral.neutral9}, ${neutral.neutral10})`,

  transition: 'all 0.3s',
  variants: {
    isFullScreen: {
      true: {
        width: '100vw',
      },
      false: {
        width: '100%',
      },
    },
  },
});

const albumArtCSS = css({
  boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.18)',
  position: 'absolute',
  inset: '0 0 0 0',
  pointerEvents: 'none',
  background: 'linear-gradient(to bottom right, $error8, $error4)',
});

const AlbumArtContainer = styled('div', {
  position: 'relative',
  height: '50vh',
  width: '50vh',
});

const AlbumArtPlaceholder = styled('div', albumArtCSS);

const YouTubePlaceholder = styled('div', albumArtCSS);

const AlbumArtImage = styled('img', albumArtCSS);

const AlbumTitle = styled('h1', {
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: '700',
  marginTop: '1rem',
  textShadow: '0px 2px #2F2F2F',
});

const AlbumArtist = styled('p', {
  color: 'white',
  textShadow: '0px 2px #2F2F2F',
  lineHeight: 0,
  marginTop: '1rem',
});

const AlbumArt = ({
  song,
  position,
  maxZ,
}: {
  song: Song;
  position: any;
  maxZ: number;
}) => {
  const track = useSpotifyTrack(song);

  const zIndex = maxZ - position;

  const size = 50 - position * 5;

  const isSpotifySong = !!song.spotifyUri;

  const styles = css({
    height: `${size}vh`,
    width: `${size}vh`,
    zIndex,
    transform: `translate(${position * 2.5}vh, -${position}rem)`,
    filter: isSpotifySong ? `contrast(${1 - position * 0.2})` : 'none',
  });

  if (position >= 5) return <></>;
  if (song.youtube_video_id) return <YouTubePlaceholder className={styles()} />;
  if (!track) return <AlbumArtPlaceholder className={styles()} />;
  return <AlbumArtImage src={track.album.images[0].url} className={styles()} />;
};

export const RoomPage = (props: Props) => {
  const router = useRouter();
  const room = useMonitorRoom(router.query.slug as string);
  const [sidepanelStatus] = useAtom(sidepanelAtom);
  const queue = useQueue(room.id);
  const activeSong = queue ? queue[0] || undefined : undefined;
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const track = useSpotifyTrack(activeSong);
  const { normalGradient } = useGradientsFromImageRef(
    track ? track.album.images[0].url : undefined
  );
  const backgroundStyles = !!track
    ? {
        style: { background: normalGradient },
      }
    : {};

  useSpotifyHandlePlayback(activeSong);

  const hasAllowedAutoPlay = useHasAllowedAutoPlay();
  const isInactive = useIsInactive();
  const isSongInQueue = track && activeSong;

  return (
    <Layout>
      <Head>
        <title>{room.name || 'Room'} | Listen Together</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PageLayout>
        <AlbumBackground
          {...backgroundStyles}
          isFullScreen={!sidepanelStatus.isRightOpen}
          css={{
            cursor: isInactive ? 'none' : 'inherit',
          }}
        >
          <FixedButtons room={room} song={activeSong} show={!isInactive} />
          {activeSong && activeSong.youtube_video_id && (
            <YouTubePlayer
              song={activeSong}
              hideCursor={isInactive}
              hasAllowedAutoPlay={hasAllowedAutoPlay}
            />
          )}
          {activeSong && activeSong.spotifyUri && isLoggedIn && (
            <AlbumArtContainer>
              {/* <FixedPlaybackButtons song={activeSong} /> */}
              {queue.map((song, i) => (
                <AlbumArt
                  song={song}
                  position={i}
                  maxZ={queue.length}
                  key={song.addedAt}
                />
              ))}
            </AlbumArtContainer>
          )}
          {isLoggedIn ? (
            <>
              <AlbumTitle>
                {isSongInQueue ? track.name : 'Nothing is playing.'}
              </AlbumTitle>
              <AlbumArtist>
                {isSongInQueue
                  ? track.artists[0].name
                  : 'Queue a song with the "+" icon in the top right!'}
              </AlbumArtist>
            </>
          ) : (
            <>
              <AlbumTitle>Login to listen together!</AlbumTitle>
              <AlbumArtist
                style={{
                  maxWidth: '24rem',
                  lineHeight: 1.3,
                  textAlign: 'center',
                  marginTop: '0.25rem',
                }}
              >
                Join other users in {room.name} to listen to music, queue songs,
                and chat with friends.
              </AlbumArtist>
              <a href={BASE_URL + '/api/spotify/login'}>
                <Button
                  mt={4}
                  variant='solid'
                  colorScheme='green'
                  size='lg'
                  leftIcon={<FaSpotify />}
                >
                  Login with Spotify
                </Button>
              </a>
            </>
          )}
        </AlbumBackground>
        <ChatComponent />
      </PageLayout>
    </Layout>
  );
};

export default RoomPage;
