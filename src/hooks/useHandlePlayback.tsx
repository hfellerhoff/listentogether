import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { useAuthContext } from '@/lib/AuthProvider';
import { PLAYBACK_STATE } from 'constants/playback';
import PlaybackAPI from 'src/lib/playback';
import Song from 'src/models/Song';
import { playbackConfigurationAtom } from 'src/state/playbackConfigurationAtom';
import useStore from 'src/state/store';

import useSongProgress from './rooms/useSongProgress';

export default function useHandlePlayback(song?: Song) {
  const { session } = useAuthContext();

  const { spotify, youtube } = useStore((store) => ({
    spotify: store.spotify,
    youtube: store.youtube,
  }));

  const [playbackConfiguration] = useAtom(playbackConfigurationAtom);

  const progress = useSongProgress(song);

  useEffect(() => {
    if (!session?.provider_token) return;

    const props = {
      spotify,
      spotifyAccessToken: session?.provider_token,
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
        await PlaybackAPI.pause(props);
        await PlaybackAPI.skip(props);
      } else if (isClientPlaying && song.isPaused) {
        console.log('Song should not be playing, pausing...');
        await PlaybackAPI.pause(props);
      } else if (!isClientPlaying && !song.isPaused) {
        await PlaybackAPI.play(props);
      } else if (!isSynchronized && !song.isPaused) {
        console.log('Song is out of sync, synchronizing...');
        await PlaybackAPI.play(props);
      }
    };

    updatePlayback();
  }, [
    session?.provider_token,
    spotify,
    youtube,
    playbackConfiguration,
    song,
    progress,
  ]);
}
