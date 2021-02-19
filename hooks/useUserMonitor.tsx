import { useEffect } from 'react';
import Service from '../models/Service';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../state/spotifyAtom';
import useSpotifyAuthentication from './useSpotifyAuthentication';
import { userAtom } from '../state/userAtom';
import User from '../models/User';
import { useRouter } from 'next/router';
import supabase from '../util/supabase';

const useUserMonitor = () => {
  const router = useRouter();
  const [spotifyAPI, _] = useAtom(spotifyAtom);
  const [user, setUser] = useAtom(userAtom);
  const { isLoading, accessToken } = useSpotifyAuthentication();

  useEffect(() => {
    const updateUser = async () => {
      if (!accessToken) return;
      try {
        spotifyAPI.setAccessToken(accessToken);
        const spotifyUser = await spotifyAPI.getMe();

        let { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('serviceId', spotifyUser.id);

        if (users && users.length > 0) {
          setUser(users[0] as User);
        }
      } catch (error) {
        console.error('User fetch error:');
        console.error(error);
        router.push('/api/spotify/login');
      }
    };

    if (accessToken && !user.id) updateUser();
  }, [accessToken, user, setUser]);

  return isLoading;
};

export default useUserMonitor;
