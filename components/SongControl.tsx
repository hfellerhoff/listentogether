import React, { useState, useEffect } from 'react';
import { Flex, IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import { FiPause, FiSkipForward, FiPlay, FiLink2 } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import Song from '../models/Song';
import { RoomPlaybackQuery } from '../pages/api/rooms/playback';
import { playbackConfigurationAtom } from '../state/playbackConfigurationAtom';

interface Props {
  song: Song;
  progress: number;
}

const SongControl = ({ song, progress }: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const [playbackConfiguration, setPlaybackConfiguration] = useAtom(
    playbackConfigurationAtom
  );
  const [changeToIsPaused, setChangeToIsPaused] = useState(true);
  const [isSkippingSong, setIsSkippingSong] = useState(false);

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

  return (
    <Flex align='center' justify='center'>
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
        <IconButton
          onClick={handleTogglePlaybackConfiguration}
          icon={<FiLink2 fontSize='1.25em' />}
          aria-label='Return to previous song'
          variant={playbackConfiguration.linked ? 'solid' : 'ghost'}
          colorScheme={playbackConfiguration.linked ? 'blue' : 'gray'}
          size={playbackConfiguration.linked ? 'sm' : 'md'}
        />
      </Tooltip>
      <IconButton
        aria-label={isPaused ? 'Play song' : 'Pause song'}
        onClick={handleTogglePlay}
        variant='ghost'
        icon={
          isPaused ? (
            <FiPlay fontSize='1.25em' />
          ) : (
            <FiPause fontSize='1.25em' />
          )
        }
        isLoading={changeToIsPaused !== isPaused}
        isDisabled={isSkippingSong}
      />
      <IconButton
        onClick={handleSkipForward}
        icon={<FiSkipForward fontSize='1.25em' />}
        aria-label='Skip to next song'
        variant='ghost'
        isLoading={isSkippingSong}
        isDisabled={changeToIsPaused !== isPaused}
      />
    </Flex>
  );
};

export default SongControl;
