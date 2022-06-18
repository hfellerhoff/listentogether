import { PLAYBACK_STATE } from 'constants/playback';
import Service from 'models/Service';
import PlaybackAPI, { PlaybackProps, PlaybackResponse } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';
import { handleAndReturn } from './utils/handleAndReturn';

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
