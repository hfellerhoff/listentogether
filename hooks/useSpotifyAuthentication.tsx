import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

enum SpotifyCookies {
  AccessToken = 'spotify-access-token',
  RefreshToken = 'spotify-refresh-token',
}

const useSpotifyAuthentication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [cookies, setCookies] = useCookies([
    SpotifyCookies.AccessToken,
    SpotifyCookies.RefreshToken,
  ]);

  useEffect(() => {
    if (router.query) {
      if (router.query.access_token) {
        const { access_token, refresh_token, expires_in } = router.query;
        setCookies(SpotifyCookies.AccessToken, JSON.stringify(access_token), {
          path: '/',
          maxAge: parseInt(expires_in as string),
          sameSite: true,
        });
        setCookies(SpotifyCookies.RefreshToken, JSON.stringify(refresh_token), {
          path: '/',
          maxAge: 3600 * 24,
          sameSite: true,
        });
      } else {
        if (
          router.pathname !== '/' &&
          !isLoading &&
          (!cookies[SpotifyCookies.AccessToken] ||
            !cookies[SpotifyCookies.RefreshToken])
        ) {
          router.replace('/');
        }
      }
      if (isLoading) setIsLoading(false);
    }
  }, [router.query, cookies]);

  return {
    isLoading,
    accessToken: cookies[SpotifyCookies.AccessToken] as string,
    refreshToken: cookies[SpotifyCookies.RefreshToken] as string,
  };
};

export default useSpotifyAuthentication;
