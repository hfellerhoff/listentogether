import Service from 'src/models/Service';

import PlaybackAPI, { PlaybackProps } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';

export const getSongDuration = async (
  props: PlaybackProps
): Promise<number> => {
  if (!props.song) return 1;

  const service = PlaybackAPI.getActiveService(props);

  if (service === Service.Spotify)
    return await SpotifyAPI.getSongDuration(props);

  if (service === Service.YouTube)
    return await YouTubeAPI.getSongDuration(props);

  return 1;
};
