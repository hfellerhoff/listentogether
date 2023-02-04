import { createAPIRoute } from 'src/util/api/createAPIRoute';

import { _before } from './_before';
import { getIsSynchronized } from './getIsSynchronized';
import { getPlaybackStatus } from './getPlaybackStatus';
import { getSongDuration } from './getSongDuration';
import { getTargetDevice } from './getTargetDevice';
import { pause } from './pause';
import { play } from './play';
import { buildListenTogetherAPIUrl } from '../listen-together';

const SpotifyAPI = {
  Routes: {
    authToken: createAPIRoute('https://accounts.spotify.com/api/token'),
    authAuthorize: createAPIRoute('https://accounts.spotify.com/authorize'),
    authLogin: createAPIRoute(buildListenTogetherAPIUrl('/api/spotify/login')),
    authRedirect: createAPIRoute(
      buildListenTogetherAPIUrl('/api/spotify/callback')
    ),
    authCallback: createAPIRoute(buildListenTogetherAPIUrl('/dashboard')),
  },
  Cookies: {
    AUTH_STATE_KEY: 'spotify_auth_state',
  },
  Secrets: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  },

  play: _before(play),
  pause: _before(pause),
  getPlaybackStatus: _before(getPlaybackStatus),
  getSongDuration: _before(getSongDuration),
  getTargetDevice: _before(getTargetDevice),
  getIsSynchronized: _before(getIsSynchronized),
};

export default SpotifyAPI;

// eslint-disable-next-line import/no-anonymous-default-export
// export default {};
