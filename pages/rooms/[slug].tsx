import ChatComponent from '../../components/Room/Chat/ChatComponent';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import PlaybackHeader from '../../components/PlaybackHeader/PlaybackHeader';
import DashboardBottomBar from '../../components/Room/DashboardBottomBar';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import Layout from '../../components/Layout';
import Head from 'next/head';
import useMonitorRoom from '../../hooks/rooms/useMonitorRoom';
import useSpotifyHandlePlayback from '../../hooks/spotify/useSpotifyHandlePlayback';
import useQueue from '../../hooks/rooms/useQueue';
import QueuedSongDisplay from '../../components/Room/QueuedSongDisplay';
import useGradientsFromImageRef from '../../hooks/useGradientsFromImageRef';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import { css, styled } from '@stitches/react';
import FixedButtons from '../../components/Room/FixedButtons';
import SongProgress from '../../components/SongProgress';
import Song from '../../models/Song';
import FixedPlaybackButtons from '../../components/Room/FixedPlaybackButtons';
import { sidepanelAtom } from '../../state/sidepanelAtom';

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

  transition: 'all 0.3s',
  variants: {
    placeholder: {
      true: {
        background: 'linear-gradient(to bottom right, $neutral6, $neutral7',
      },
    },

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
});

const AlbumArtContainer = styled('div', {
  position: 'relative',
  height: '50vh',
  width: '50vh',
});

const AlbumArtPlaceholder = styled('div', {
  ...albumArtCSS,
  background: 'linear-gradient(to bottom right, $neutral2, $neutral3)',
});

const AlbumArtImage = styled('img', {
  ...albumArtCSS,
});

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
  const styles = css({
    height: `${size}vh`,
    width: `${size}vh`,
    zIndex,
    transform: `translate(${position * 2.5}vh, -${position}rem)`,
    filter: `contrast(${1 - position * 0.2})`,
  });

  if (position >= 5) return <></>;
  if (!track) return <AlbumArtPlaceholder className={styles()} />;
  return <AlbumArtImage src={track.album.images[0].url} className={styles()} />;
};

export const RoomPage = (props: Props) => {
  const router = useRouter();
  const room = useMonitorRoom(router.query.slug as string);
  const [sidepanelStatus] = useAtom(sidepanelAtom);
  const queue = useQueue(room.id);
  const activeSong = queue ? queue[0] || undefined : undefined;

  const track = useSpotifyTrack(activeSong);
  const { normalGradient } = useGradientsFromImageRef(
    track ? track.album.images[0].url : undefined
  );
  const backgroundStyles = !!track
    ? {
        style: { background: normalGradient },
      }
    : {};

  useSpotifyHandlePlayback(room, activeSong);

  const isSongInQueue = track && activeSong;

  return (
    <Layout>
      <Head>
        <title>{room.name || 'Room'} | Listen Together</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PageLayout>
        <AlbumBackground
          placeholder={!track}
          {...backgroundStyles}
          isFullScreen={!sidepanelStatus.isRightOpen}
        >
          <FixedButtons room={room} song={activeSong} />
          {isSongInQueue && (
            <AlbumArtContainer>
              <FixedPlaybackButtons song={activeSong} />
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
          <AlbumTitle>
            {isSongInQueue ? track.name : 'Nothing is playing.'}
          </AlbumTitle>
          <AlbumArtist>
            {isSongInQueue
              ? track.artists[0].name
              : 'Queue a song with the "+" icon in the top right!'}
          </AlbumArtist>
        </AlbumBackground>
        <ChatComponent />
      </PageLayout>
    </Layout>
  );
};

export default RoomPage;
