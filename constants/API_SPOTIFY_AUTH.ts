export const API_SPOTIFY_AUTH_STATE_KEY = 'spotify_auth_state';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_URL
    : 'https://beta.listentogether.app';

export const API_SPOTIFY_AUTH_REDIRECT_URI = `${BASE_URL}/api/spotify/callback`;
export const API_SPOTIFY_AUTH_CALLBACK_URI = `${BASE_URL}/dashboard?`;
