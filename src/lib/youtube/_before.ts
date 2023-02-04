import { PlaybackProps } from '../playback';

export const _before =
  (callback: (props: PlaybackProps) => any) => async (props: PlaybackProps) => {
    return await callback(props);
  };
