import * as querystring from 'querystring';
import generateRandomString from '../../../util/api/generateRandomString';
import { serialize } from 'cookie';
import { API_SPOTIFY_AUTH_STATE_KEY } from '../../../constants/API_SPOTIFY_AUTH';

const isDevelopment = true; // !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const redirect_uri = isDevelopment
  ? 'http://localhost:3000/api/spotify/callback'
  : 'http://listentogether.app/api/spotify/callback';
const callbackURI = isDevelopment
  ? 'http://localhost:3000/dashboard'
  : 'http://listentogether.app/dashboard';

const scope =
  'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';

const client_id = process.env.SPOTIFY_CLIENT_ID;

export default function handler(req, res) {
  const state = generateRandomString(16);
  res.setHeader(
    'Set-Cookie',
    serialize(API_SPOTIFY_AUTH_STATE_KEY, state, { path: '/' })
  );
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
      })
  );
}
