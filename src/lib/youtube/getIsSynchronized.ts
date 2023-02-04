import { PlaybackIsSynchronizedProps } from '../playback/getIsSynchronized';

export const getIsSynchronized = async ({
  youtube,
  progress,
  outOfSyncMS,
}: PlaybackIsSynchronizedProps): Promise<boolean> => {
  if (!youtube) return true;

  const playerProgress = (await youtube.getCurrentTime()) * 1000;

  return Math.abs(progress - playerProgress) <= outOfSyncMS;
};
