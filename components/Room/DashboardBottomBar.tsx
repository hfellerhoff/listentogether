import React from 'react';
import {
  Box,
  Heading,
  Stack,
  Button,
  Flex,
  Tooltip,
  Text,
  useClipboard,
  Spinner,
} from '@chakra-ui/react';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import { FiLogOut, FiCopy } from 'react-icons/fi';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/userAtom';
import Room from '../../models/Room';
import { FaRegHeart, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

interface Props {
  room: Room | undefined;
}

const DashboardBottomBar = ({ room }: Props) => {
  const { foregroundColor } = useBackgroundColor();
  const [user] = useAtom(userAtom);

  return (
    <Box>
      <Stack
        pt={4}
        pb={8}
        px={4}
        bg={foregroundColor}
        align='center'
        justify='center'
        display={['none', 'none', 'flex', 'flex']}
      >
        {room ? (
          <>
            <Flex align='center' justify='center'>
              <Heading size='lg' mb={2} textAlign='center'>
                {room.name}
              </Heading>
              <Tooltip label='Favorite room' aria-label='Favorite room'>
                <Box ml={2}>
                  <FaRegHeart />
                </Box>
              </Tooltip>
            </Flex>
            <Flex>
              <Link href='/dashboard'>
                <a>
                  <Button
                    colorScheme='red'
                    leftIcon={<FaSignOutAlt />}
                    size='sm'
                  >
                    Leave
                  </Button>
                </a>
              </Link>
            </Flex>
          </>
        ) : (
          <>
            <Heading size='md' mb={2}>
              No room selected.
            </Heading>
            <Link href='/dashboard'>
              <a>
                <Button colorScheme='red' leftIcon={<FaSignOutAlt />} size='sm'>
                  <Text ml={2}>Back to Home</Text>
                </Button>
              </a>
            </Link>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardBottomBar;
