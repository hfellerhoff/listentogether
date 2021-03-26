import React, { useState, useEffect } from 'react';
import { Flex, IconButton, Spinner } from '@chakra-ui/react';
import { FiPause, FiSkipBack, FiSkipForward, FiPlay } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import Song from '../models/Song';
import { RoomPlaybackQuery } from '../pages/api/rooms/playback';
import useSpotifyAuthentication from '../hooks/useSpotifyAuthentication';
import useSpotifyHandlePlayback from '../hooks/spotify/useSpotifyHandlePlayback';

interface Props {
  song: Song;
  progress: number;
}

const SongControl = ({ song, progress }: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const [changeToIsPaused, setChangeToIsPaused] = useState(true);

  const isPaused = song ? song.isPaused : false;
  const isOwner = true;

  useEffect(() => {
    setChangeToIsPaused(isPaused);
  }, [isPaused]);

  const handleSkipBack = () => spotifyApi.skipToPrevious();
  const handleSkipForward = () => spotifyApi.skipToNext();
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
      <IconButton
        onClick={handleSkipBack}
        isDisabled={!isOwner}
        icon={<FiSkipBack fontSize='1.25em' />}
        aria-label='Return to previous song'
        variant='ghost'
      />
      <IconButton
        aria-label={isPaused ? 'Play song' : 'Pause song'}
        isDisabled={isOwner ? changeToIsPaused !== isPaused : true}
        onClick={handleTogglePlay}
        variant='ghost'
        icon={
          changeToIsPaused === isPaused ? (
            isPaused ? (
              <FiPlay fontSize='1.25em' />
            ) : (
              <FiPause fontSize='1.25em' />
            )
          ) : (
            <Spinner />
          )
        }
      />
      <IconButton
        onClick={handleSkipForward}
        isDisabled={!isOwner}
        icon={<FiSkipForward fontSize='1.25em' />}
        aria-label='Skip to next song'
        variant='ghost'
      />
    </Flex>
  );
};

export default SongControl;
