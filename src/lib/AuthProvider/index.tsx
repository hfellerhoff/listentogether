import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Session } from '@supabase/supabase-js';

import supabase from 'src/util/supabase';

const SPOTIFY_SCOPES =
  'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';
export type AuthService = 'spotify';
const signIn = async (service: AuthService) => {
  if (service === 'spotify') {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: SPOTIFY_SCOPES,
          redirectTo:
            window?.location?.href || 'https://www.listentogether.app',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const signOut = async (service: AuthService) => {
  if (service === 'spotify') {
    await supabase.auth.signOut();
  }
};

type UnauthenticatedAuthContext = {
  isAuthenticated: false;
  session: null;
};
type AuthenticatedAuthContext = {
  isAuthenticated: true;
  session: Omit<Session, 'provider_token'> & {
    provider_token: string;
  };
};
type AuthContext = (UnauthenticatedAuthContext | AuthenticatedAuthContext) & {
  isSessionLoading: boolean;
  signIn: typeof signIn;
  signOut: typeof signOut;
};
const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadInitialAuthState = async () => {
      const sessionResponse = await supabase.auth.getSession();
      if (sessionResponse.error) {
        setIsSessionLoading(false);
        return;
      }

      if (!sessionResponse.data.session) {
        setIsSessionLoading(false);
        return;
      }

      if (!sessionResponse.data.session?.provider_token) {
        signIn('spotify');
        return;
      }

      setSession(sessionResponse.data.session);
      setIsSessionLoading(false);
    };

    supabase.auth.onAuthStateChange((authEvent, session) => {
      if (!session?.provider_token) {
        signIn('spotify');
        return;
      }
      setSession(session);
    });
    loadInitialAuthState();
  }, []);

  // TODO: Figure out how to type this with discriminated unions
  return (
    <AuthContext.Provider
      value={{
        isSessionLoading,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        isAuthenticated: !!session,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      'useAuthContext must be used in combination with an AuthProvider.'
    );
  }

  return context;
};
