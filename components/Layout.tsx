import { Box, Center, Spinner, useColorMode } from '@chakra-ui/react';
import React from 'react';
import useBackgroundColor from '../hooks/useBackgroundColor';
import useSpotifyWebPlayback from '../hooks/useSpotifyWebPlayback';
import useUserMonitor from '../hooks/useUserMonitor';
import DeviceSelectDrawer from './Drawers/DeviceSelectDrawer';
import SongSearchDrawer from './Drawers/SongSearchDrawer';

interface Props {
  children: JSX.Element | JSX.Element[];
  publicRoute?: boolean;
}

const Layout = ({ children, publicRoute }: Props) => {
  const { backgroundColor } = useBackgroundColor();

  if (!publicRoute) {
    useUserMonitor();
  }

  return (
    <main>
      <Box minH='100vh' bg={backgroundColor}>
        {children}
      </Box>
      {!publicRoute ? (
        <>
          <SongSearchDrawer />
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
