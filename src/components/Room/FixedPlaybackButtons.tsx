import { useEffect, useState } from 'react';

import { DarkMode, Spinner, Tooltip } from '@chakra-ui/react';
import {
  Link1Icon,
  LinkBreak1Icon,
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
} from '@radix-ui/react-icons';
import { styled } from '@stitches/react';
import { useAtom } from 'jotai';

import { trpc } from 'src/server/client';

import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import Song from '../../models/Song';
import { playbackConfigurationAtom } from '../../state/playbackConfigurationAtom';

type Props = {
  song: Song;
};

const FloatingContainer = styled('div', {
  position: 'absolute',
  zIndex: 10,
  display: 'flex',
  minHeight: '3rem',
  inset: 0,

  alignItems: 'center',
  justifyContent: 'center',
  background: 'black',

  transform: '0.2s opacity ease-in-out',
  opacity: 0,
  '&:hover': {
    opacity: 0.5,
  },
});

const CircularButton = styled('button', {
  display: 'grid',
  placeItems: 'center',

  cursor: 'pointer',
  height: '3.5rem',
  width: '3.5rem',
  borderRadius: '100%',

  '&:hover': {
    background: '$neutral9',
  },
});

const FixedPlaybackButtons = ({ song }: Props) => {
  const [playbackConfiguration, setPlaybackConfiguration] = useAtom(
    playbackConfigurationAtom
  );
  const [changeToIsPaused, setChangeToIsPaused] = useState(true);
  const [isSkippingSong, setIsSkippingSong] = useState(false);
  const track = useSpotifyTrack(song);

  const { mutateAsync: updatePlayback } = trpc.updatePlayback.useMutation();

  const isPaused = song ? song.isPaused : false;

  useEffect(() => {
    setChangeToIsPaused(isPaused);
  }, [isPaused]);

  const handleTogglePlaybackConfiguration = () =>
    setPlaybackConfiguration({
      ...playbackConfiguration,
      linked: !playbackConfiguration.linked,
    });

  const handleSkipForward = async () => {
    if (!track) return;
    setIsSkippingSong(true);

    await updatePlayback({
      shouldSkip: true,
      songId: song.id,
      track: {
        spotify_uri: track.uri,
        duration_ms: track.duration_ms,
      },
    });

    setIsSkippingSong(false);
  };

  const handleTogglePlay = async () => {
    setChangeToIsPaused(!isPaused);

    await updatePlayback({
      isPaused: !isPaused,
      songId: song.id,
    });
  };

  if (!song) return <></>;
  return (
    <DarkMode>
      <FloatingContainer>
        <Tooltip
          label={
            playbackConfiguration.linked
              ? 'Unlink playback to room'
              : 'Link playback to room'
          }
          aria-label={
            playbackConfiguration.linked
              ? 'Unlink playback to room'
              : 'Link playback to room'
          }
          placement='bottom'
          zIndex={8}
        >
          <CircularButton
            onClick={handleTogglePlaybackConfiguration}
            aria-label={
              playbackConfiguration.linked
                ? 'Unlink playback to room'
                : 'Link playback to room'
            }
          >
            {playbackConfiguration.linked ? (
              <LinkBreak1Icon height={24} width={24} color='white' />
            ) : (
              <Link1Icon height={24} width={24} color='white' />
            )}
          </CircularButton>
        </Tooltip>
        <Tooltip
          label={isPaused ? 'Play song' : 'Pause song'}
          aria-label={isPaused ? 'Play song' : 'Pause song'}
          placement='bottom'
          zIndex={8}
        >
          <CircularButton
            onClick={handleTogglePlay}
            aria-label={isPaused ? 'Play song' : 'Pause song'}
          >
            {changeToIsPaused !== song.isPaused ? (
              <Spinner size='sm' />
            ) : song.isPaused ? (
              <PlayIcon height={24} width={24} color='white' />
            ) : (
              <PauseIcon height={24} width={24} color='white' />
            )}
          </CircularButton>
        </Tooltip>

        <Tooltip
          label={'Skip to next song'}
          aria-label={'Skip to next song'}
          placement='bottom'
          zIndex={8}
        >
          <CircularButton
            onClick={handleSkipForward}
            aria-label='Skip to next song'
          >
            {isSkippingSong ? (
              <Spinner size='sm' />
            ) : (
              <TrackNextIcon height={24} width={24} color='white' />
            )}
          </CircularButton>
        </Tooltip>
      </FloatingContainer>
    </DarkMode>
  );
};

export default FixedPlaybackButtons;
