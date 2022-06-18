import Service from 'models/Service';
import { PlaybackProps, PlaybackResponse } from '.';
import SpotifyAPI from '../spotify';
import YouTubeAPI from '../youtube';
import { handleAndReturn } from './utils/handleAndReturn';

export const getActiveService = ({ song }: PlaybackProps): Service => {
  if (!song) return Service.None;

  const { spotifyUri, youtube_video_id } = song;
  if (spotifyUri) return Service.Spotify;
  if (youtube_video_id) return Service.YouTube;

  return Service.None;
};
