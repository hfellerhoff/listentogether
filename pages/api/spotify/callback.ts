import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import * as request from 'request';
import supabase from '../../../util/supabase/index';

import Spotify from 'spotify-web-api-node';
import API from '@/lib/api';

const callbackURI = API.Spotify.Routes.authCallback;

const client_id = API.Spotify.Secrets.CLIENT_ID;
const client_secret = API.Spotify.Secrets.CLIENT_SECRET;

const callback = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies
      ? req.cookies[API.Spotify.Cookies.AUTH_STATE_KEY]
      : null;

    if (state === null || state !== storedState) {
      res.redirect(
        callbackURI.withParams({
          error: 'state_mismatch',
        })
      );
      return resolve('');
    }

    res.setHeader(
      'Set-Cookie',
      serialize(API.Spotify.Cookies.AUTH_STATE_KEY, '', {
        maxAge: -1,
        path: '/',
      })
    );

    const authOptions = {
      url: API.Spotify.Routes.authToken.get(),
      form: {
        code,
        redirect_uri: API.Spotify.Routes.authRedirect.get(),
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
          await supabase
            .from('users')
            .insert([user])
            .then((insertedUser) => {
              console.log('User successfully inserted.');
              console.log(insertedUser);
            });
        }

        // If user exists, update fields
        else {
          await supabase
            .from('users')
            .update([user])
            .eq('id', supabaseResponse.data[0].id);
        }

        // Pass the access token back to the Listen Together client
        // to be able to make client-side API requests
        res.redirect(
          callbackURI.withParams({
            access_token,
            refresh_token,
            expires_in,
          })
        );
        return resolve('');
      } else {
        // On invalid token,
        res.redirect(
          callbackURI.withParams({
            error: 'invalid_token',
          })
        );
        return resolve('');
      }
    });
  });

export default callback;
