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

      request.post(authOptions, function (error, response, body) {
        // On successful login
        if (!error && response.statusCode === 200) {
          const { access_token, refresh_token, expires_in } = body;

          // console.log("SUPABASE details: ")
          // console.log(supabase)
          // spotifyAPI = Spotify.SpotifyWebApiJs;
          const spotifyAPI = new Spotify();
          spotifyAPI.setAccessToken(access_token);
          spotifyAPI.getMe().then((res) => {
            console.log('HERE:');
            console.log(res);
            const user = {
              service: 'spotify',
              serviceId: res.body.id,
              name: res.body.display_name || '',
              imageSrc: res.body.images
                ? res.body.images[0]
                  ? res.body.images[0].url || ''
                  : ''
                : '',
              online: false,
            };
            supabase
              .from('users')
              .select('*')

              .eq('serviceId', user.serviceId)
              .then((res_2) => {
                console.log('RES_2, array: ');
                console.log(res_2);
                if (res_2.data.length === 0) {
                  supabase
                    .from('users')
                    .insert([user])
                    .then((res_1) => {
                      console.log('RES 1: ');
                      console.log(res_1);
                    });
                  // console.log(supabase)
                }
              });
          });
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
