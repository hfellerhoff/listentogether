import React, { useState, useEffect } from 'react';
import { Flex, IconButton, Spinner } from '@chakra-ui/react';
import { FiPause, FiSkipBack, FiSkipForward, FiPlay } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import Song from '../models/Song';
import { RoomPlaybackQuery } from '../pages/api/rooms/playback';
import useSpotifyAuthentication from '../hooks/useSpotifyAuthentication';

interface Props {
  song: Song;
  progress: number;
}

const SongControl = ({ song, progress }: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const [changeToIsPaused, setChangeToIsPaused] = useState(true);
  const { accessToken } = useSpotifyAuthentication();

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
      await fetch('/api/rooms/playback', {
        method: 'POST',
        body: JSON.stringify({
          isPaused: !isPaused,
          songId: song.id,
        } as RoomPlaybackQuery),
      });
    }
    // Pause song
    else {
      await fetch('/api/rooms/playback', {
        method: 'POST',
        body: JSON.stringify({
          isPaused: !isPaused,
          songId: song.id,
          progress,
        } as RoomPlaybackQuery),
      });
    }
  };

  useEffect(() => {
    const updatePlayback = async () => {
      if (song && progress >= 0) {
        spotifyApi.setAccessToken(accessToken);

        try {
          const devices = await spotifyApi.getMyDevices();
          console.log(devices);

          let targetDeviceId = '';
          const activeDevices = devices.devices.filter((d) => d.is_active);
          if (devices.devices.length > 0) {
            if (activeDevices.length === 0) {
              targetDeviceId = devices.devices[0].id;
            }
          }

          console.log(activeDevices);
          console.log(targetDeviceId);

          const playback = await spotifyApi.getMyCurrentPlaybackState();
          console.log(playback);

          if (playback) {
            if (song.isPaused && playback.is_playing) {
              spotifyApi.pause();
            } else if (!song.isPaused) {
              if (playback.item.uri !== song.spotifyUri) {
                const x = new Date();
                const now = x.getTime() + x.getTimezoneOffset() * 60 * 1000;

                const position_ms =
                  now - Date.parse(song.updatedAt).valueOf() + song.progress;

                spotifyApi.play({
                  uris: [song.spotifyUri],
                  position_ms,
                });
              } else if (
                !playback.is_playing ||
                Math.abs(progress - playback.progress_ms) > 1000
              ) {
                spotifyApi.play({
                  uris: [song.spotifyUri],
                  position_ms: progress,
                });
              }
            }
          } else {
            if (!song.isPaused) {
              spotifyApi.play({
                uris: [song.spotifyUri],
                position_ms: progress,
                device_id: targetDeviceId,
              });
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    updatePlayback();
  }, [song]);

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
