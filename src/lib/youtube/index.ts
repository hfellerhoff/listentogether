import { _before } from './_before';
import { getIsSynchronized } from './getIsSynchronized';
import { getPlaybackStatus } from './getPlaybackStatus';
import { getSongDuration } from './getSongDuration';
import { pause } from './pause';
import { play } from './play';

const YouTubeAPI = {
  // Methods
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  play: _before(play),
  pause: _before(pause),
  getPlaybackStatus: _before(getPlaybackStatus),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getSongDuration: _before(getSongDuration),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getIsSynchronized: _before(getIsSynchronized),
};

export default YouTubeAPI;
