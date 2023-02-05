import { PlaybackProps } from '../playback';

export const _before =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (callback: (props: PlaybackProps) => any) => async (props: PlaybackProps) => {
    return await callback(props);
  };
