import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Room, { Queue } from '../../models/Room';
import Song from '../../models/Song';
import { playbackConfigurationAtom } from '../../state/playbackConfigurationAtom';
import { roomAtom } from '../../state/roomAtom';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSongProgress from '../rooms/useSongProgress';
import useSpotifyAuthentication from './useSpotifyAuthentication';
import useSpotifyTrack from './useSpotifyTrack';

const useSpotifyHandlePlayback = (room: Room, song: Song) => {
  const { accessToken } = useSpotifyAuthentication();
  const [spotifyApi] = useAtom(spotifyAtom);
  const [playbackConfiguration] = useAtom(playbackConfigurationAtom);

  const progress = useSongProgress(song);
  const track = useSpotifyTrack(song);

  console.log(song);

  useEffect(() => {
    const getTargetDevice = async () => {
      spotifyApi.setAccessToken(accessToken);
      const devices = await spotifyApi.getMyDevices();

      const activeDevices = devices.devices.filter((d) => d.is_active);
      if (devices.devices.length > 0) {
        if (activeDevices.length === 0) {
          return devices.devices[0].id;
        } else {
          return activeDevices[0].id;
        }
      }
    };

    const updatePlayback = async () => {
      // If not linked, don't update playback
      if (!playbackConfiguration.linked) return;

      spotifyApi.setAccessToken(accessToken);

      try {
        // The device to play music on
        const targetDeviceID = await getTargetDevice();

        // Current Spotify playback state (is playing? what song? etc.)
        const playback = await spotifyApi.getMyCurrentPlaybackState();

        if (song && progress >= 0) {
          // If there is playback information,
          if (playback) {
            // CLIENT: Something playing
            // SERVER: Song paused
            // ACTION: Pause song playing on client
            if (song.isPaused && playback.is_playing) {
              spotifyApi.pause();
            }

            // SERVER: Song playing
            else if (!song.isPaused) {
              // If the song is finished, do nothing
              if (track.duration_ms - 1000 <= progress) return;

              // If song playing on Spotify does not match the server's song,
              // play the server's song
              if (playback.item.uri !== song.spotifyUri) {
                // Recalculate progress when swapping songs to avoid playing
                // in the middle of the song
                const x = new Date();
                const now = x.valueOf();

                const position_ms =
                  now - Date.parse(song.updatedAt).valueOf() + song.progress;

                await spotifyApi.play({
                  uris: [song.spotifyUri],
                  position_ms,
                });
              }

              // If song matches server song but is out of sync with server,
              // tell Spotify to play at the server's song position (progress)
              else if (
                !playback.is_playing ||
                Math.abs(progress - playback.progress_ms) > 1000
              ) {
                await spotifyApi.play({
                  uris: [song.spotifyUri],
                  position_ms: progress,
                });
              }

              // If playing the right song and is within the sync limit, do nothing
            }
          }

          // If there is no playback information,
          else {
            // If song from server is not paused, play song at current position
            if (!song.isPaused) {
              await spotifyApi.play({
                uris: [song.spotifyUri],
                position_ms: progress,
                device_id: targetDeviceID,
              });
            }
          }
        }

        // If there is no active song and user has playback, pause it
        else if (!song && playback.is_playing) {
          await spotifyApi.pause();
        }
      } catch (err) {
        console.error(err);
      }
    };

    updatePlayback();
  }, [song, progress]);
};

export default useSpotifyHandlePlayback;
