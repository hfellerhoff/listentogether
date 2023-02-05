import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

import supabase from '@/util/supabase';
import { Profile, SupabaseProfile } from 'src/models/Profile';

import { AuthService, useAuthContext } from '../AuthProvider';

const getUser = async (
  service: AuthService,
  session: ReturnType<typeof useAuthContext>['session']
): Promise<Profile | null> => {
  if (service === 'spotify' && session) {
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(session.provider_token);
    const spotifyUser = await spotify.getMe();

    let profilePhoto = '';
    if (spotifyUser.images?.length) {
      profilePhoto = spotifyUser.images[0].url;
    }

    return {
      id: session.user.id,
      serviceId: spotifyUser.id,
      service: service,
      username: spotifyUser.display_name || null,
      isPremium: spotifyUser.product === 'premium',
      avatarUrl: profilePhoto,
    };
  }

  return null;
};

type PlatformUserContext = {
  user: Profile | null;
  isUserLoading: boolean;
  refetchUser: () => void;
};
const PlatformUserContext = createContext<PlatformUserContext | null>(null);

export default function ProfileProvider({ children }: PropsWithChildren) {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { session, signIn } = useAuthContext();
  const [user, setUser] = useState<Profile | null>(null);

  const fetchAndSetUser = useCallback(async () => {
    if (!session?.provider_token) return;

    try {
      const updatedUser = await getUser('spotify', session);
      if (!updatedUser) return;

      const supabaseProfiles = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .limit(1);

      if (supabaseProfiles.data?.length === 0) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          service_id: updatedUser.serviceId,
          service: updatedUser.service,
          username: updatedUser.username,
          avatar_url: updatedUser.avatarUrl,
        } as Partial<SupabaseProfile>);
      }

      setUser(updatedUser);
    } catch (error) {
      setUser(null);
      signIn('spotify');
    }
    setIsUserLoading(false);
  }, [session, signIn]);

  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  return (
    <PlatformUserContext.Provider
      value={{
        user,
        isUserLoading,
        refetchUser: fetchAndSetUser,
      }}
    >
      {children}
    </PlatformUserContext.Provider>
  );
}

export const useProfileContext = () => {
  const context = useContext(PlatformUserContext);

  if (context === null) {
    throw new Error(
      'useProfileContext must be used in combination with an ProfileProvider.'
    );
  }

  return context;
};
