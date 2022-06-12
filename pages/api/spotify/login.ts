import generateRandomString from '../../../util/api/generateRandomString';
import { serialize } from 'cookie';
import API from '@/lib/api';

const redirect_uri = API.Spotify.Routes.authRedirect.get();

const scope =
  'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';

const client_id = API.Spotify.Secrets.CLIENT_ID;

export default function handler(req, res) {
  const state = generateRandomString(16);
  res.setHeader(
    'Set-Cookie',
    serialize(API.Spotify.Cookies.AUTH_STATE_KEY, state, { path: '/' })
  );

  res.redirect(
    API.Spotify.Routes.authAuthorize.withParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })
  );
}
