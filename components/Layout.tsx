import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSpotifyAuthentication from '../hooks/spotify/useSpotifyAuthentication';
import useBackgroundColor from '../hooks/useBackgroundColor';
import useUserMonitor from '../hooks/useUserMonitor';
import DeviceSelectDrawer from './Drawers/DeviceSelectDrawer';
import PlaybackControlDrawer from './Drawers/PlaybackControlDrawer';
import SongSearchDrawer from './Drawers/SongSearchDrawer';

interface Props {
  children: JSX.Element | JSX.Element[];
  publicRoute?: boolean;
}

const Layout = ({ children, publicRoute }: Props) => {
  const { backgroundColor } = useBackgroundColor();
  const router = useRouter();

  const shouldRedirect = !router.pathname.includes('/rooms/');

  if (!publicRoute) {
    useUserMonitor({ shouldRedirect });
  }

  return (
    <main>
      <Box minH='100vh' bg={backgroundColor}>
        {children}
      </Box>
      {!publicRoute && (
        <>
          <SongSearchDrawer />
          <DeviceSelectDrawer />
          <PlaybackControlDrawer />
        </>
      )}
    </main>
  );
};

export default Layout;
