import { PlaybackProps } from '../playback';

export const _before =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (callback: (props: PlaybackProps) => any) => async (props: PlaybackProps) => {
    const { spotify, spotifyAccessToken } = props;
    spotify.setAccessToken(spotifyAccessToken);

    return callback(props);
  };
