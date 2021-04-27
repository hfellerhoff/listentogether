import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Room, { Queue } from '../../models/Room';
import Song from '../../models/Song';
import { roomAtom } from '../../state/roomAtom';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSongProgress from '../rooms/useSongProgress';
import useSpotifyAuthentication from '../useSpotifyAuthentication';

const useSpotifyHandlePlayback = (room: Room, queue: Queue) => {
  const { accessToken } = useSpotifyAuthentication();
  const [spotifyApi] = useAtom(spotifyAtom);

  const song = queue[0];
  const progress = useSongProgress(song);

  useEffect(() => {
    const getTargetDevice = async () => {
      const devices = await spotifyApi.getMyDevices();

      const activeDevices = devices.devices.filter((d) => d.is_active);
      if (devices.devices.length > 0) {
        if (activeDevices.length === 0) {
          return devices.devices[0].id;
        }
      }
    };

    const updatePlayback = async () => {
      if (song) {
        spotifyApi.setAccessToken(accessToken);

        try {
          const targetDeviceID = await getTargetDevice();

          const playback = await spotifyApi.getMyCurrentPlaybackState();

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
                device_id: targetDeviceID,
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
};

export default useSpotifyHandlePlayback;
