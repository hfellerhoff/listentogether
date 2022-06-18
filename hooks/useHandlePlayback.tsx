import useSpotifyAuthentication from './spotify/useSpotifyAuthentication';
import { useAtom } from 'jotai';
import Song from 'models/Song';
import useSongProgress from './rooms/useSongProgress';
import { useEffect } from 'react';
import { playbackConfigurationAtom } from 'state/playbackConfigurationAtom';
import PlaybackAPI from '@/lib/playback';
import { PLAYBACK_STATE } from 'constants/playback';
import useStore from 'state/store';

export default function useHandlePlayback(song: Song) {
  const { accessToken } = useSpotifyAuthentication({ shouldRedirect: false });

  const { spotify, youtube } = useStore((store) => ({
    spotify: store.spotify,
    youtube: store.youtube,
  }));

  const [playbackConfiguration] = useAtom(playbackConfigurationAtom);

  const progress = useSongProgress(song);

  useEffect(() => {
    const props: any = {
      spotify,
      spotifyAccessToken: accessToken,
      youtube,
      song,
      progress,
    };

    const updatePlayback = async () => {
      if (!song || !song.duration_ms) return;
      if (progress <= 10) return;
      if (song.duration_ms <= 10) return;
      if (!playbackConfiguration.linked) return;
      if (song.youtube_video_id && !youtube) return;

      const playbackPromise = PlaybackAPI.getPlaybackStatus(props);
      const isSynchronizedPromise = PlaybackAPI.getIsSynchronized(props);

      const [playback, isSynchronized] = await Promise.all([
        playbackPromise,
        isSynchronizedPromise,
      ]);

      const isClientPlaying = playback === PLAYBACK_STATE.PLAYING;
      const isSongOver = song.duration_ms <= progress;

      if (isSongOver) {
        console.log('Song is over, skipping...');
        await PlaybackAPI.skip(props);
      } else if (isClientPlaying && song.isPaused) {
        console.log('Song should not be playing, pausing...');
        await PlaybackAPI.pause(props);
      } else if (!isClientPlaying && !song.isPaused) {
        console.log('Song should be playing, playing...');
        await PlaybackAPI.play(props);
      } else if (!isSynchronized && !song.isPaused) {
        console.log('Song is out of sync, synchronizing...');
        await PlaybackAPI.play(props);
      }
    };

    updatePlayback();
  }, [accessToken, spotify, youtube, playbackConfiguration, song, progress]);
}
