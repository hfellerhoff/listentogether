import type Song from 'src/models/Song';
import { SpotifyAPI, YouTubeAPI } from 'src/state/store';

import { getActiveService } from './getActiveService';
import { getIsSynchronized } from './getIsSynchronized';
import { getPlaybackStatus } from './getPlaybackStatus';
import { getSongDuration } from './getSongDuration';
import { pause } from './pause';
import { play } from './play';
import { skip } from './skip';

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
