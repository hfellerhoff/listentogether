import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';

import { useProfileContext } from 'src/lib/UserProvider';

import { isPremiumAtom } from '../../state/isPremiumAtom';
import { getFirstName } from '../../util/helpers/getFirstName';

const DashboardWelcome = () => {
  const { colorMode } = useColorMode();
  const { user } = useProfileContext();
  const [isPremium] = useAtom(isPremiumAtom);

  return (
    <Flex direction='column' align='center' justify='center'>
      <Box>
        <Image
          src={colorMode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
          height={100}
          width={150}
          alt='Listen Together logo'
        />
      </Box>
      <Box textAlign='center' mb={[4, 4, 8, 8]} mt={[4, 4, 8, 8]}>
        <Heading size='2xl'>
          {user?.displayName
            ? `Welcome back, ${getFirstName(user.displayName)}!`
            : 'Welcome back!'}
        </Heading>
        <Text fontSize={20}>It&apos;s great to see you again.</Text>
        {!isPremium && (
          <Alert status='warning' mt={4} textAlign='left' gap={2}>
            <AlertIcon ml={2} />
            <Flex direction='column'>
              <AlertTitle>
                Oops! Looks like you don&apos;t have Spotify Premium.
              </AlertTitle>
              <AlertDescription maxW='36rem'>
                Controlling playback with the Spotify API is limited to premium
                users. Free users can still enter rooms and chat, but they
                won&apos;t be able to sync their music with friends.
              </AlertDescription>
            </Flex>
          </Alert>
        )}
      </Box>
    </Flex>
  );
};

export default DashboardWelcome;
