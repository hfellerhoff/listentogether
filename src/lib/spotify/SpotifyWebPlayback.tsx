import { PropsWithChildren, useEffect, useState } from 'react';

import { useAuthContext } from '@/lib/AuthProvider';

const SPOTIFY_PLAYER_SCRIPT_SRC = 'https://sdk.scdn.co/spotify-player.js';

export default function SpotifyWebPlayback({ children }: PropsWithChildren) {
  const { session } = useAuthContext();
  const [isWebPlaybackReady, setIsWebPlaybackReady] = useState(false);

  useEffect(() => {
    const hasAddedScript =
      Object.values(document.getElementsByTagName('script')).filter(
        (element) => element.src === SPOTIFY_PLAYER_SCRIPT_SRC
      ).length > 0;

    if (!hasAddedScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsWebPlaybackReady(true);
    };
  }, []);

  // Create the web player
  useEffect(() => {
    const hasWebPlayer = !!window.spotifyWebPlayer;

    if (hasWebPlayer || !session?.provider_token || !isWebPlaybackReady) {
      return;
    }

    console.log('Spotify Web Playback SDK ready.');

    window.spotifyWebPlayer = new Spotify.Player({
      name: 'Listen Together Web Application',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(session?.provider_token);
      },
      volume: 1,
    });

    // Error handling
    window.spotifyWebPlayer.addListener(
      'initialization_error',
      ({ message }) => {
        console.error(message);
      }
    );
    window.spotifyWebPlayer.addListener(
      'authentication_error',
      ({ message }) => {
        console.error(message);
      }
    );
    window.spotifyWebPlayer.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    window.spotifyWebPlayer.addListener('playback_error', ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    // window.spotifyWebPlayer.addListener('window.spotifyWebPlayer_state_changed', (state) => {
    //   // console.log(state);
    // });

    // Ready
    window.spotifyWebPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    window.spotifyWebPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    window.spotifyWebPlayer.connect();
  }, [session?.provider_token, isWebPlaybackReady]);

  return <>{children}</>;
}
