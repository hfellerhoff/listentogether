import { PlaybackProps, PlaybackResponse } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';
import { handleAndReturn } from './utils/handleAndReturn';

export const pause = async (
  props: PlaybackProps
): Promise<PlaybackResponse<void>> =>
  handleAndReturn({
    youtube: YouTubeAPI.pause(props),
    spotify: SpotifyAPI.pause(props),
  });
