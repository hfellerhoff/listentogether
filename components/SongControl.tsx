import React, { useState, useEffect } from 'react';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import {
  Link1Icon,
  LinkBreak1Icon,
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
} from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import Song from '../models/Song';
import { RoomPlaybackQuery } from '../pages/api/rooms/playback';
import { playbackConfigurationAtom } from '../state/playbackConfigurationAtom';
import useSpotifyTrack from '../hooks/spotify/useSpotifyTrack';

interface Props {
  song: Song;
  progress: number;
}

const SongControl = ({ song, progress }: Props) => {
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
          spotify_uri: song.spotifyUri,
          youtube_video_id: song.youtube_video_id,
          duration_ms: song.duration_ms,
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
        placement='top-start'
        zIndex={8}
      >
        <IconButton
          onClick={handleTogglePlaybackConfiguration}
          icon={
            playbackConfiguration.linked ? (
              <LinkBreak1Icon fontSize='1.25em' />
            ) : (
              <Link1Icon fontSize='1.25em' />
            )
          }
          aria-label='Return to previous song'
          variant='ghost'
          rounded='full'
        />
      </Tooltip>
      <IconButton
        aria-label={isPaused ? 'Play song' : 'Pause song'}
        onClick={handleTogglePlay}
        variant='ghost'
        icon={
          isPaused ? (
            <PlayIcon fontSize='1.25em' />
          ) : (
            <PauseIcon fontSize='1.25em' />
          )
        }
        isLoading={changeToIsPaused !== isPaused}
        isDisabled={isSkippingSong}
        rounded='full'
        mx={-0.5}
      />
      <IconButton
        onClick={handleSkipForward}
        icon={<TrackNextIcon fontSize='1.25em' />}
        aria-label='Skip to next song'
        variant='ghost'
        isLoading={isSkippingSong}
        isDisabled={changeToIsPaused !== isPaused}
        rounded='full'
        ml={-0.5}
      />
    </Flex>
  );
};

export default SongControl;
