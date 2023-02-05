import { PlaybackIsSynchronizedProps } from '../playback/getIsSynchronized';

export const getIsSynchronized = async ({
  spotify,
  progress,
  outOfSyncMS,
}: PlaybackIsSynchronizedProps): Promise<boolean> => {
  const playback = await spotify.getMyCurrentPlaybackState();
  if (!playback.progress_ms) return true;

  return Math.abs(progress - playback.progress_ms) <= outOfSyncMS;
};
