import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import { Provider } from 'jotai';
import useSpotifyWebPlayback from '../hooks/spotify/useSpotifyWebPlayback';

import { globalStyles } from '../stitches.config';
import StitchesThemeController from '../components/StitchesThemeController';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  useSpotifyWebPlayback();
  globalStyles();

  return (
    <ThemeProvider>
      <StitchesThemeController>
        <ChakraProvider>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </ChakraProvider>
      </StitchesThemeController>
    </ThemeProvider>
  );
}
