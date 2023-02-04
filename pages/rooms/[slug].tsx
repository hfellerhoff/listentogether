import { useMemo } from 'react';

import { Button } from '@chakra-ui/react';
import { css, styled } from '@stitches/react';
import { useAtom } from 'jotai';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaSpotify } from 'react-icons/fa';

import YouTubePlayer from 'src/components/YouTubePlayer';
import useHandlePlayback from 'src/hooks/useHandlePlayback';
import useHasAllowedAutoPlay from 'src/hooks/useHasAllowedAutoPlay';
import useIsInactive from 'src/hooks/useIsInactive';

import Layout from '../../src/components/Layout';
import ChatComponent from '../../src/components/Room/Chat/ChatComponent';
import FixedButtons from '../../src/components/Room/FixedButtons';
import useMonitorRoom from '../../src/hooks/rooms/useMonitorRoom';
import useQueue from '../../src/hooks/rooms/useQueue';
import useSpotifyTrack from '../../src/hooks/spotify/useSpotifyTrack';
import useGradientsFromImageRef from '../../src/hooks/useGradientsFromImageRef';
import Song from '../../src/models/Song';
import { sidepanelAtom } from '../../src/state/sidepanelAtom';
import { neutral } from '../../stitches.config';
import { useAuthContext } from '@/lib/AuthProvider';

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
  position: number;
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

export const RoomPage = () => {
  const router = useRouter();
  const slug = useMemo(() => {
    if (router.query.slug && typeof router.query.slug === 'string') {
      return router.query.slug;
    }

    if (window) {
      const urlPortions = new URL(window.location.toString()).pathname.split(
        '/'
      );
      const windowSlug = urlPortions[urlPortions.length - 1];
      if (windowSlug) return windowSlug;
    }

    return undefined;
  }, [router.query.slug]);

  const room = useMonitorRoom(slug);
  const queue = useQueue(room.id);
  const song = queue ? queue[0] || undefined : undefined;

  useHandlePlayback(song);

  const [sidepanelStatus] = useAtom(sidepanelAtom);
  const { isAuthenticated, signIn } = useAuthContext();
  const track = useSpotifyTrack(song);

  const { normalGradient } = useGradientsFromImageRef(
    track ? track.album.images[0].url : undefined
  );

  const backgroundStyles = track
    ? {
        style: { background: normalGradient },
      }
    : {};

  const hasAllowedAutoPlay = useHasAllowedAutoPlay();
  const isInactive = useIsInactive();
  const isSongInQueue = !!track && !!song;

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
          <FixedButtons room={room} song={song} show={!isInactive} />
          {song && song.youtube_video_id && (
            <YouTubePlayer
              song={song}
              hideCursor={isInactive}
              hasAllowedAutoPlay={hasAllowedAutoPlay}
            />
          )}
          {queue &&
            queue.length > 0 &&
            song &&
            !song.youtube_video_id &&
            isAuthenticated && (
              <AlbumArtContainer>
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
          {isAuthenticated ? (
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
              <AlbumTitle>Log in to listen together!</AlbumTitle>
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

              <Button
                mt={4}
                variant='solid'
                colorScheme='green'
                size='lg'
                leftIcon={<FaSpotify />}
                onClick={() => signIn('spotify')}
              >
                Login with Spotify
              </Button>
            </>
          )}
        </AlbumBackground>
        <ChatComponent />
      </PageLayout>
    </Layout>
  );
};

export default RoomPage;
