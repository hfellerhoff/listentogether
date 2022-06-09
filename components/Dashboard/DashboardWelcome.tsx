import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Image,
  Text,
  useColorMode,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { getFirstName } from '../../util/helpers/getFirstName';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/userAtom';
import { isPremiumAtom } from '../../state/isPremiumAtom';

interface Props {}

const DashboardWelcome = (props: Props) => {
  const { colorMode } = useColorMode();
  const [user] = useAtom(userAtom);
  const [isPremium] = useAtom(isPremiumAtom);

  return (
    <Flex direction='column' align='center' justify='center'>
      <Box>
        <Image
          src={colorMode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
          height={100}
          width={150}
        />
      </Box>
      <Box textAlign='center' mb={[4, 4, 8, 8]} mt={[4, 4, 8, 8]}>
        <Heading size='2xl'>
          {user ? `Welcome back, ${getFirstName(user.name)}!` : 'Welcome back!'}
        </Heading>
        <Text fontSize={20}>It's great to see you again.</Text>
        {!isPremium && (
          <Alert status='warning' mt={4} textAlign='left' gap={2}>
            <AlertIcon ml={2} />
            <Flex direction='column'>
              <AlertTitle>
                Oops! Looks like you don't have Spotify Premium.
              </AlertTitle>
              <AlertDescription maxW='36rem'>
                Controlling playback with the Spotify API is limited to premium
                users. Free users can still enter rooms and chat, but they won't
                be able to sync their music with friends.
              </AlertDescription>
            </Flex>
          </Alert>
        )}
      </Box>
    </Flex>
  );
};

export default DashboardWelcome;
