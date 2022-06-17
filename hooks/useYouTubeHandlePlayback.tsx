import { useAtom } from 'jotai';
import { RoomPlaybackQuery } from 'pages/api/rooms/playback';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { activeSongAtom } from 'state/activeSongAtom';
import { playbackConfigurationAtom } from 'state/playbackConfigurationAtom';
import Song from '../models/Song';
import useSongProgress from './rooms/useSongProgress';

const useSpotifyHandlePlayback = (
  song: Song,
  youtube: YouTube | undefined,
  canPlayVideo: boolean
) => {
  const [playbackConfiguration] = useAtom(playbackConfigurationAtom);
  const [activeSong, setActiveSong] = useAtom(activeSongAtom);
  const [playerProgress, setPlayerProgress] = useState(0);

  const progress = useSongProgress(song);

  useEffect(() => {
    let timeout;

    const updatePlayerProgress = () => {
      if (timeout) clearTimeout(timeout);

      youtube.internalPlayer
        .getCurrentTime()
        .then((v) => setPlayerProgress(v * 1000));

      timeout = setTimeout(updatePlayerProgress, 500);
    };

    if (youtube) updatePlayerProgress();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [youtube, canPlayVideo]);

  useEffect(() => {
    const setSongDuration = async () => {
      const duration = await youtube.internalPlayer.getDuration();

      setActiveSong({ ...activeSong, duration_ms: duration * 1000 });
    };

    if (activeSong.duration_ms <= 1 && canPlayVideo) {
      setSongDuration();
    }
  }, [youtube, canPlayVideo]);

  useEffect(() => {
    const getPlaybackState = async () => {
      const stateCode = await youtube.internalPlayer.getPlayerState();

      switch (stateCode) {
        case -1:
          return 'unstarted';
        case 0:
          return 'ended';
        case 1:
          return 'playing';
        case 2:
          return 'paused';
        case 3:
          return 'buffering';
        case 5:
          return 'video-cued';
        default:
          return null;
      }
    };

    const updatePlayback = async () => {
      // If not linked, don't update playback
      if (!playbackConfiguration.linked) return;

      // If not a youtube song
      if (song && !song.youtube_video_id) return;

      // If no player or video isn't loaded
      if (!youtube || !canPlayVideo) return;

      const playbackStatus = await getPlaybackState();

      try {
        if (song && progress >= 0) {
          if (canPlayVideo) {
            // SERVER: Song playing
            if (!song.isPaused) {
              //If song is finished and there is another song in the queue
              // console.log('time left: ' + (track.duration_ms - progress));
              if (
                activeSong.duration_ms > 1 &&
                activeSong.duration_ms <= progress
              ) {
                await fetch('/api/rooms/playback', {
                  method: 'POST',
                  body: JSON.stringify({
                    shouldSkip: true,
                    isSkipAtEnd: true,
                    songId: song.id,
                    track: {
                      youtube_video_id: song.youtube_video_id,
                      duration_ms: activeSong.duration_ms,
                    },
                  } as RoomPlaybackQuery),
                });
              }

              // If the song is finished, do nothing
              if (activeSong.duration_ms <= progress) return;
              // If song matches server song but is out of sync with server,
              // tell Spotify to play at the server's song position (progress)
              else if (
                playbackStatus !== 'playing' ||
                Math.abs(progress - playerProgress) > 1500
              ) {
                youtube.internalPlayer.seekTo(progress / 1000);
                youtube.internalPlayer.playVideo();
              }

              // If playing the right song and is within the sync limit, do nothing
            }

            // SERVER: Song paused
            else {
              if (playbackStatus === 'playing') {
                youtube.internalPlayer.pauseVideo();
              }
            }
          }

          // If there is no playback information,
          else {
            // If song from server is not paused, play song at current position
            if (!song.isPaused && playbackStatus !== 'playing') {
              youtube.internalPlayer.seekTo(progress / 1000);
              youtube.internalPlayer.playVideo();
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    updatePlayback();
  }, [song, progress, youtube, canPlayVideo, activeSong]);
};

export default useSpotifyHandlePlayback;
