import type Song from 'models/Song';
import { getPlaybackStatus } from './getPlaybackStatus';
import { pause } from './pause';
import { play } from './play';
import { skip } from './skip';
import YouTube from 'react-youtube';
import { getSongDuration } from './getSongDuration';
import { getActiveService } from './getActiveService';
import { getIsSynchronized } from './getIsSynchronized';
import { SpotifyAPI, YouTubeAPI } from 'state/store';

export type PlaybackProps = {
  spotify: SpotifyAPI;
  spotifyAccessToken: string;

  youtube: YouTubeAPI;

  song?: Song;
};

export type PlaybackResponse<T> = {
  spotify: T;
  youtube: T;
};

// A functional set of helper methods for managing implemented streaming services and platforms.
const PlaybackAPI = {
  getPlaybackStatus,
  getSongDuration,
  getActiveService,
  getIsSynchronized,
  play,
  pause,
  skip,
};

export default PlaybackAPI;
