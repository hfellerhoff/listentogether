import Service from 'models/Service';
import PlaybackAPI, { PlaybackProps, PlaybackResponse } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';
import { calculateProgress } from './utils/calculateProgress';

const OUT_OF_SYNC_MS = 2000;

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
