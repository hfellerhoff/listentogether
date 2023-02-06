import Service from 'src/models/Service';

import PlaybackAPI, { PlaybackProps } from '.';
import { calculateProgress } from './utils/calculateProgress';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';

const OUT_OF_SYNC_MS = 3000;

export type PlaybackIsSynchronizedProps = PlaybackProps & {
  progress: number; // server song progress ms
  outOfSyncMS: number;
};

export const getIsSynchronized = async (
  props: PlaybackProps
): Promise<boolean> => {
  const service = PlaybackAPI.getActiveService(props);

  const progress = calculateProgress(props.song);
  if (!progress) return true;

  const updatedProps: PlaybackIsSynchronizedProps = {
    ...props,
    progress,
    outOfSyncMS: OUT_OF_SYNC_MS,
  };

  let isSynchronized = true;
  if (service === Service.Spotify) {
    isSynchronized = await SpotifyAPI.getIsSynchronized(updatedProps);
  }
  if (service === Service.YouTube) {
    isSynchronized = await YouTubeAPI.getIsSynchronized(updatedProps);
  }

  return isSynchronized;
};
