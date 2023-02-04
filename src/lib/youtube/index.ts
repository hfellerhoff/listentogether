import { _before } from './_before';
import { getIsSynchronized } from './getIsSynchronized';
import { getPlaybackStatus } from './getPlaybackStatus';
import { getSongDuration } from './getSongDuration';
import { pause } from './pause';
import { play } from './play';

const YouTubeAPI = {
  Routes: {},
  Cookies: {},
  Secrets: {},

  // Methods
  play: _before(play),
  pause: _before(pause),
  getPlaybackStatus: _before(getPlaybackStatus),
  getSongDuration: _before(getSongDuration),
  getIsSynchronized: _before(getIsSynchronized),
};

export default YouTubeAPI;
