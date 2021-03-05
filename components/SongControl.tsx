import React, { useState, useEffect } from 'react';
import { Flex, IconButton, Spinner } from '@chakra-ui/react';
import { FiPause, FiSkipBack, FiSkipForward, FiPlay } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import Song from '../models/Song';

interface Props {
  song: Song;
}

const SongControl = ({ song }: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const [changeToIsPlaying, setChangeToIsPlaying] = useState(true);

  const isPlaying = !song.isPaused;
  const isOwner = true;

  useEffect(() => {
    setChangeToIsPlaying(isPlaying);
  }, [isPlaying]);

  const handleSkipBack = () => spotifyApi.skipToPrevious();
  const handleSkipForward = () => spotifyApi.skipToNext();
  const handleTogglePlay = () => {
    setChangeToIsPlaying(!isPlaying);
    isPlaying ? spotifyApi.pause() : spotifyApi.play();
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
        aria-label={isPlaying ? 'Pause song' : 'Play song'}
        isDisabled={isOwner ? changeToIsPlaying !== isPlaying : true}
        onClick={handleTogglePlay}
        variant='ghost'
        icon={
          changeToIsPlaying === isPlaying ? (
            isPlaying ? (
              <FiPause fontSize='1.25em' />
            ) : (
              <FiPlay fontSize='1.25em' />
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
