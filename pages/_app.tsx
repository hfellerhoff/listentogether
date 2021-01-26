import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import { Provider } from 'jotai';
import useSpotifyWebPlayback from '../hooks/useSpotifyWebPlayback';

export default function App({ Component, pageProps }) {
  useSpotifyWebPlayback();

  return (
    <ChakraProvider>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}
