import { createAPIRoute } from '@/util/api/createAPIRoute';
import { buildListenTogetherAPIUrl } from './listen-together';

const SpotifyAPI = {
  Routes: {
    authToken: createAPIRoute('https://accounts.spotify.com/api/token'),
    authAuthorize: createAPIRoute('https://accounts.spotify.com/authorize'),
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
};

export default SpotifyAPI;
