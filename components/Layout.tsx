import { Box, Center, Spinner, useColorMode } from '@chakra-ui/react';
import React from 'react';
import useBackgroundColor from '../hooks/useBackgroundColor';
import useSpotifyWebPlayback from '../hooks/useSpotifyWebPlayback';
import useUserMonitor from '../hooks/useUserMonitor';
import DeviceSelectDrawer from './Drawers/DeviceSelectDrawer';

interface Props {
  children: JSX.Element | JSX.Element[];
  publicRoute?: boolean;
}

const Layout = ({ children, publicRoute }: Props) => {
  const { colorMode } = useColorMode();
  const { backgroundColor } = useBackgroundColor();

  if (!publicRoute) {
    const isLoading = useUserMonitor();
    // if (isLoading)
    //   return (
    //     <Center minH='100vh'>
    //       <Spinner size='lg' />
    //     </Center>
    //   );
  }

  return (
    <main>
      <Box
        minH='100vh'
        // bg={colorMode === 'light' ? '#EEEEEE' : '#19202D'}
        bg={backgroundColor}
      >
        {children}
      </Box>
      {!publicRoute ? (
        <>
          {/* <SongSearchDrawer /> */}
          <DeviceSelectDrawer />
          {/* <PlaybackControlDrawer /> */}
        </>
      ) : (
        <></>
      )}
    </main>
  );
};

export default Layout;
