import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import * as querystring from 'querystring';
import * as request from 'request';
import { API_SPOTIFY_AUTH_STATE_KEY } from '../../../constants/API_SPOTIFY_AUTH';

const isDevelopment = true; // !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const redirect_uri = isDevelopment
  ? 'http://localhost:3000/api/spotify/callback'
  : 'http://listentogether.app/api/spotify/callback';
const callbackURI = isDevelopment
  ? 'http://localhost:3000/dashboard?'
  : 'http://listentogether.app/dashboard?';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const callback = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies
      ? req.cookies[API_SPOTIFY_AUTH_STATE_KEY]
      : null;

    if (state === null || state !== storedState) {
      res.redirect(
        callbackURI +
          querystring.stringify({
            error: 'state_mismatch',
          })
      );
      return resolve('');
    } else {
      res.setHeader(
        'Set-Cookie',
        serialize(API_SPOTIFY_AUTH_STATE_KEY, '', {
          maxAge: -1,
          path: '/',
        })
      );
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64'),
        },
        json: true,
      };

      request.post(authOptions, function (error, response, body) {
        // On successful login
        if (!error && response.statusCode === 200) {
          const { access_token, refresh_token, expires_in } = body;

          // TODO: Fetch user information from Spotify

          // TODO: If user exists, update fields

          // TODO: If user does not exist, create new user

          // Pass the access token back to the Listen Together client
          // to be able to make client-side API requests
          res.redirect(
            callbackURI +
              querystring.stringify({
                access_token,
                refresh_token,
                expires_in,
              })
          );
          return resolve('');
        } else {
          res.redirect(
            callbackURI +
              querystring.stringify({
                error: 'invalid_token',
              })
          );
          return resolve('');
        }
      });
    }
  });

export default callback;
