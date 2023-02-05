import { PLAYBACK_STATE } from 'constants/playback';
import Service from 'src/models/Service';

import PlaybackAPI, { PlaybackProps } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';

export const getPlaybackStatus = async (
  props: PlaybackProps
): Promise<PLAYBACK_STATE> => {
  const service = PlaybackAPI.getActiveService(props);

  let playbackStatus;
  if (service === Service.Spotify) {
    playbackStatus = await SpotifyAPI.getPlaybackStatus(props);
  }
  if (service === Service.YouTube) {
    playbackStatus = await YouTubeAPI.getPlaybackStatus(props);
  }

  return playbackStatus;
};
