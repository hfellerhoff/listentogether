import { PlaybackProps, PlaybackResponse } from '.';
import { handleAndReturn } from './utils/handleAndReturn';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';

export const pause = async (
  props: PlaybackProps
): Promise<PlaybackResponse<void>> =>
  handleAndReturn({
    youtube: YouTubeAPI.pause(props),
    spotify: SpotifyAPI.pause(props),
  });
