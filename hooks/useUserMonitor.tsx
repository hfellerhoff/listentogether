import { useEffect } from 'react';
import Service from '../models/Service';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import useSpotifyAuthentication from './useSpotifyAuthentication';
import { userAtom } from '../state/userAtom';
import User from '../models/User';

const useUserMonitor = () => {
  const [spotifyAPI, _] = useAtom(spotifyAtom);
  const [user, setUser] = useAtom(userAtom);
  const { isLoading, accessToken } = useSpotifyAuthentication();

  useEffect(() => {
    const updateUser = async () => {
      if (!accessToken) return;
      try {
        spotifyAPI.setAccessToken(accessToken);
        const spotifyUser = await spotifyAPI.getMe();

        setUser({
          service: 'spotify' as Service,
          id: spotifyUser.id,
          name: spotifyUser.display_name || '',
          imageSrc: spotifyUser.images
            ? spotifyUser.images[0]
              ? spotifyUser.images[0].url || ''
              : ''
            : '',
        } as User);
      } catch (error) {
        console.error('User fetch error:');
        console.error(error);
      }
    };

    if (accessToken && !user.id) updateUser();
  }, [accessToken, user, setUser]);

  return isLoading;
};

export default useUserMonitor;
