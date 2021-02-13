import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Image,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { getFirstName } from '../../util/helpers/getFirstName';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/userAtom';

interface Props {}

const DashboardWelcome = (props: Props) => {
  const { colorMode } = useColorMode();
  const [user, _] = useAtom(userAtom);

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
          {user
            ? `Welcome back, ${getFirstName(user.name)}!`
            : 'Welcome back!'}
        </Heading>
        <Text fontSize={20}>It's great to see you again.</Text>
      </Box>
    </Flex>
  );
};

export default DashboardWelcome;
