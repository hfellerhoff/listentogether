import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import * as querystring from 'querystring';
import * as request from 'request';
import {
  API_SPOTIFY_AUTH_CALLBACK_URI,
  API_SPOTIFY_AUTH_REDIRECT_URI,
  API_SPOTIFY_AUTH_STATE_KEY,
} from '../../../constants/API_SPOTIFY_AUTH';
import supabase from '../../../util/supabase/index';

// import { useAtom } from 'jotai';
// import { spotifyAtom } from '../../../state/spotifyAtom';
import Spotify from 'spotify-web-api-node';

const redirect_uri = API_SPOTIFY_AUTH_REDIRECT_URI;
const callbackURI = API_SPOTIFY_AUTH_CALLBACK_URI;

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

      request.post(authOptions, async function (error, response, body) {
        // On successful login
        if (!error && response.statusCode === 200) {
          const { access_token, refresh_token, expires_in } = body;

          // Get user's data from Spotify
          const spotifyAPI = new Spotify();
          spotifyAPI.setAccessToken(access_token);
          const spotifyResponse = await spotifyAPI.getMe();
          const spotifyUser = spotifyResponse.body;
          const user = {
            service: 'spotify',
            serviceId: spotifyUser.id,
            name: spotifyUser.display_name || '',
            imageSrc: spotifyUser.images
              ? spotifyUser.images[0]
                ? spotifyUser.images[0].url || ''
                : ''
              : '',
            online: false,
          };

          // Check if user exists in database
          const supabaseResponse = await supabase
            .from('users')
            .select('*')
            .eq('serviceId', user.serviceId);

          // If user does not exist, insert into database
          if (supabaseResponse.data.length === 0) {
            supabase
              .from('users')
              .insert([user])
              .then((insertedUser) => {
                console.log('User successfully inserted.');
                console.log(insertedUser);
              });
          }

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
