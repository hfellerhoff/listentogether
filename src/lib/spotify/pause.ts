import { PlaybackProps } from '../playback';

export const pause = async ({ spotify }: PlaybackProps) => {
  return await spotify.pause();
};
