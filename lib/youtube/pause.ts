import { PlaybackProps } from '../playback';

export const pause = async ({ youtube }: PlaybackProps) => {
  if (!youtube) return;

  return await youtube.pauseVideo();
};
