import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import { Provider } from 'jotai';

import { globalStyles } from '../stitches.config';
import StitchesThemeController from '../components/StitchesThemeController';
import { ThemeProvider } from 'next-themes';
import useSpotifyWebPlayback from 'hooks/spotify/useSpotifyWebPlayback';

export default function App({ Component, pageProps }) {
  globalStyles();
  useSpotifyWebPlayback();

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
