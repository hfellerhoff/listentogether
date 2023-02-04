import { useState, useEffect } from 'react';

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

import { RoomPlaybackQuery } from '../../../pages/api/rooms/playback';
import useSongProgress from '../../hooks/rooms/useSongProgress';
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
  const progress = useSongProgress(song);

  const [playbackConfiguration, setPlaybackConfiguration] = useAtom(
    playbackConfigurationAtom
  );
  const [changeToIsPaused, setChangeToIsPaused] = useState(true);
  const [isSkippingSong, setIsSkippingSong] = useState(false);
  const track = useSpotifyTrack(song);

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
    console.log('Skipping song...');
    setIsSkippingSong(true);

    await fetch('/api/rooms/playback', {
      method: 'POST',
      body: JSON.stringify({
        shouldSkip: true,
        songId: song.id,
        track: {
          uri: track.uri,
          duration_ms: track.duration_ms,
        },
      } as RoomPlaybackQuery),
    });

    setIsSkippingSong(false);
    console.log('Skipped song.');
  };

  const handleTogglePlay = async () => {
    setChangeToIsPaused(!isPaused);

    // Play song
    if (isPaused) {
      console.log('Playing song...');

      await fetch('/api/rooms/playback', {
        method: 'POST',
        body: JSON.stringify({
          isPaused: !isPaused,
          songId: song.id,
        } as RoomPlaybackQuery),
      });

      console.log('Played song.');
    }
    // Pause song
    else {
      console.log('Pausing song...');

      await fetch('/api/rooms/playback', {
        method: 'POST',
        body: JSON.stringify({
          isPaused: !isPaused,
          songId: song.id,
          progress,
        } as RoomPlaybackQuery),
      });

      console.log('Paused song.');
    }
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
