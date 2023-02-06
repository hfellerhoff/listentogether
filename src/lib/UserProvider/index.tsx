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
): Promise<SpotifyApi.CurrentUsersProfileResponse | null> => {
  if (service === 'spotify' && session) {
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(session.provider_token);
    const spotifyUser = await spotify.getMe();

    return spotifyUser;
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
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchAndSetUser = useCallback(async () => {
    if (!session?.provider_token) return;

    try {
      const profileData = await getUser('spotify', session);
      if (!profileData) return;

      const serviceProfile = profileData;

      const supabaseProfiles = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .limit(1);
      const userProfile = supabaseProfiles.data?.length
        ? (supabaseProfiles.data[0] as SupabaseProfile)
        : null;

      let serviceAvatarUrl;
      if (serviceProfile.images?.length) {
        serviceAvatarUrl = serviceProfile.images[0].url;
      }
      if (!userProfile?.service) {
        await supabase.from('profiles').update({
          id: session.user.id,
          service: 'spotify',
          service_id: serviceProfile.id,
          service_avatar_url: serviceAvatarUrl,
          service_display_name: serviceProfile.display_name,
          display_name: serviceProfile.display_name,
        } as Partial<SupabaseProfile>);
      } else if (userProfile?.service) {
        // TODO: Only update if avatar/display name have changed
        await supabase.from('profiles').update({
          id: session.user.id,
          service_avatar_url: serviceAvatarUrl,
          service_display_name: serviceProfile.display_name,
        } as Partial<SupabaseProfile>);
      }

      setProfile({
        id: session.user.id,
        service: 'spotify',
        displayName: userProfile?.display_name || serviceProfile.display_name,
        avatarUrl: serviceAvatarUrl,
        isPremium: serviceProfile.product === 'premium',
      });
    } catch (error) {
      setProfile(null);
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
        user: profile,
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
