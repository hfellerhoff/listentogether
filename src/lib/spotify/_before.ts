import { PlaybackProps } from '../playback';

export const _before =
  (callback: (props: PlaybackProps) => any) => async (props: PlaybackProps) => {
    const { spotify, spotifyAccessToken } = props;
    spotify.setAccessToken(spotifyAccessToken);

    return callback(props);
  };
