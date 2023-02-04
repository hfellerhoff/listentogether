import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import { FaSpotify } from 'react-icons/fa';
import TextLoop from 'react-text-loop';

import DashboardWelcome from 'src/components/Dashboard/DashboardWelcome';
import JoinWithRoomCode from 'src/components/Dashboard/JoinWithRoomCode';
import FullscreenLoader from 'src/components/FullscreenLoader';
import PlaybackHeader from 'src/components/PlaybackHeader/PlaybackHeader';
import OwnerRoomRoll from 'src/components/RoomRolls/OwnerRoomRoll';
import PublicRoomRoll from 'src/components/RoomRolls/PublicRoomRoll';
import { useAuthContext } from 'src/lib/AuthProvider';

import ColorModeButton from '../src/components/ColorModeButton';
import Layout from '../src/components/Layout';

export default function Home() {
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  if (isSessionLoading) return <FullscreenLoader />;

  return (
    <div>
      <Head>
        <title>
          Listen Together - Listen to music with friends no matter where you
          are.
        </title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {isAuthenticated ? <AuthenticatedHome /> : <PublicHome />}
    </div>
  );
}

const AuthenticatedHome = () => {
  return (
    <Layout>
      <Head>
        <title>Dashboard | Listen Together</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box minH='100vh'>
        <PlaybackHeader isHome />
        <Flex
          direction='column'
          align='center'
          maxW={1200}
          p={[0, 8, 12, 16]}
          margin='0 auto'
        >
          <DashboardWelcome />
          <JoinWithRoomCode />
          <OwnerRoomRoll />
          <PublicRoomRoll />
        </Flex>
      </Box>
    </Layout>
  );
};

const PublicHome = () => {
  const { colorMode } = useColorMode();
  const { signIn } = useAuthContext();

  return (
    <Layout publicRoute>
      <ColorModeButton absolute />
      <Flex
        justify='space-between'
        p={[8, 8, 12, 16]}
        minH='100vh'
        direction='column'
        bg={colorMode === 'light' ? '#EEEEEE' : '#19202D'}
      >
        <Box>
          <Image
            src={colorMode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
            height={100}
            width={150}
            alt='Listen Together logo'
          />
        </Box>
        <Stack spacing={6}>
          <Box>
            <TextLoop interval={4000}>
              <Heading fontSize={[48, 48, 60, 72]}>Be the DJ</Heading>
              <Heading fontSize={[48, 48, 60, 72]}>Share music</Heading>
              <Heading fontSize={[48, 48, 60, 72]}>Listen together</Heading>
            </TextLoop>
            <Heading
              fontSize={[18, 24, 30, 30]}
              color={colorMode === 'light' ? '#273348' : '#E6E8E8'}
            >
              no matter where you are.
            </Heading>
          </Box>
          <Text fontSize='xl' maxW={500}>
            Grab some friends, connect your Spotify account, and listen to music
            in sync with each other.
          </Text>
        </Stack>
        <Flex
          align={['flex-start', 'flex-end', 'flex-end']}
          justify='space-between'
          direction={['column', 'row', 'row']}
        >
          <Button
            variant='solid'
            colorScheme='green'
            size='lg'
            leftIcon={<FaSpotify />}
            boxShadow='0px 5px 5px 0px rgba(0, 0, 0, 0.3)'
            onClick={() => signIn('spotify')}
          >
            Login with Spotify
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};
