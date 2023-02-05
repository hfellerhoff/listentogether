import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

import { AuthService, useAuthContext } from '../AuthProvider';

interface PlatformUser {
  name: string | undefined;
  email: string;
  profilePhoto: string;
  isPaidAccount: boolean;
}
const getUser = async (
  service: AuthService,
  accessToken: string
): Promise<PlatformUser | null> => {
  if (service === 'spotify') {
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(accessToken);
    const user = await spotify.getMe();

    let profilePhoto = '';
    if (user.images?.length) {
      profilePhoto = user.images[0].url;
    }

    return {
      name: user.display_name,
      email: user.email,
      profilePhoto,
      isPaidAccount: user.product === 'premium',
    };
  }

  return null;
};

type PlatformUserContext = {
  user: PlatformUser | null;
  isUserLoading: boolean;
  refetchUser: () => void;
};
const PlatformUserContext = createContext<PlatformUserContext | null>(null);

export default function PlatformUserProvider({ children }: PropsWithChildren) {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { session, signIn } = useAuthContext();
  const [user, setUser] = useState<PlatformUser | null>(null);

  const fetchAndSetUser = useCallback(async () => {
    if (!session?.provider_token) return;

    try {
      const updatedUser = await getUser('spotify', session.provider_token);
      setUser(updatedUser);
    } catch (error) {
      setUser(null);
      signIn('spotify');
    }
    setIsUserLoading(false);
  }, [session?.provider_token, signIn]);

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

export const usePlatformUserContext = () => {
  const context = useContext(PlatformUserContext);

  if (context === null) {
    throw new Error(
      'usePlatformUserContext must be used in combination with an PlatformUserProvider.'
    );
  }

  return context;
};
