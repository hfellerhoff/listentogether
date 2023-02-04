import { PropsWithChildren, useEffect } from 'react';

import { useAuthContext } from '@/lib/AuthProvider';

export default function SpotifyWebPlayback({ children }: PropsWithChildren) {
  const { session } = useAuthContext();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Web Playback SDK ready.');

      const player = new Spotify.Player({
        name: 'Listen Together Web Application [BETA]',
        getOAuthToken: (cb: (token: string) => void) => {
          if (!session?.provider_token) return;
          cb(session.provider_token);
        },
        volume: 1,
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      player.addListener('playback_error', ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      // player.addListener('player_state_changed', (state) => {
      //   // console.log(state);
      // });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    };
  }, [session?.provider_token]);

  return <>{children}</>;
}
