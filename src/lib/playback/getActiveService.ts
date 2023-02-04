import Service from 'src/models/Service';

import { PlaybackProps } from '.';

export const getActiveService = ({ song }: PlaybackProps): Service => {
  if (!song) return Service.None;

  const { spotifyUri, youtube_video_id } = song;
  if (spotifyUri) return Service.Spotify;
  if (youtube_video_id) return Service.YouTube;

  return Service.None;
};
