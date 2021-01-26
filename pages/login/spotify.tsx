import { Center, Spinner, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface Props {}

const BASE_URL =
  process.env.VERCEL_ENV === 'production'
    ? 'https://listentogether.app'
    : process.env.VERCEL_ENV === 'preview'
    ? 'https://listentogetherbeta.vercel.app'
    : 'http://localhost:3000';

const SpotifyLoginPage = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push(BASE_URL + '/api/spotify/login');
  }, []);

  return (
    <Center minH='100vh' p={[8, 8, 12, 16]}>
      <Stack align='center' spacing={8}>
        <Spinner size='lg' />
        <Text fontSize='lg'>Redirecting to Spotify...</Text>
      </Stack>
    </Center>
  );
};

export default SpotifyLoginPage;
