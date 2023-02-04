import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import AuthProvider from 'src/lib/AuthProvider';
import UserProvider from 'src/lib/UserProvider';

import StitchesThemeController from '../src/components/StitchesThemeController';
import { globalStyles } from '../stitches.config';
import SpotifyWebPlayback from '@/lib/spotify/SpotifyWebPlayback';

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();

  return (
    <ThemeProvider>
      <StitchesThemeController>
        <ChakraProvider>
          <AuthProvider>
            <UserProvider>
              <JotaiProvider>
                <SpotifyWebPlayback>
                  <Component {...pageProps} />
                </SpotifyWebPlayback>
              </JotaiProvider>
            </UserProvider>
          </AuthProvider>
        </ChakraProvider>
      </StitchesThemeController>
    </ThemeProvider>
  );
}
