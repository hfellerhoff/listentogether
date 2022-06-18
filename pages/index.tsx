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
import TextLoop from 'react-text-loop';
import { FaSpotify } from 'react-icons/fa';
import ColorModeButton from '../components/ColorModeButton';
import Layout from '../components/Layout';
import API from '@/lib/api';

export default function Home() {
  const { colorMode } = useColorMode();

  return (
    <div>
      <Head>
        <title>
          Listen Together - Listen to music with friends no matter where you
          are.
        </title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

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
              Grab some friends, connect your Spotify account, and listen to
              music in sync with each other.
            </Text>
          </Stack>
          <Flex
            align={['flex-start', 'flex-end', 'flex-end']}
            justify='space-between'
            direction={['column', 'row', 'row']}
          >
            <a href={API.Spotify.Routes.authLogin.get()}>
              <Button
                variant='solid'
                colorScheme='green'
                size='lg'
                leftIcon={<FaSpotify />}
                boxShadow='0px 5px 5px 0px rgba(0, 0, 0, 0.3)'
              >
                Login with Spotify
              </Button>
            </a>
          </Flex>
        </Flex>
      </Layout>

      <footer></footer>
    </div>
  );
}
