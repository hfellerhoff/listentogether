import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { FaSignOutAlt } from 'react-icons/fa';

import useBackgroundColor from '../../hooks/useBackgroundColor';
import { roomAtom, ROOM_EMPTY } from '../../state/roomAtom';

const DashboardBottomBar = () => {
  const { foregroundColor } = useBackgroundColor();
  const [room, setRoom] = useAtom(roomAtom);

  const handleLeaveRoom = () => setRoom(ROOM_EMPTY);

  return (
    <Box>
      <Stack
        pt={4}
        pb={8}
        px={4}
        w='100%'
        bg={foregroundColor}
        position='absolute'
        bottom={0}
        align='center'
        justify='center'
        display={['none', 'none', 'flex', 'flex']}
      >
        {room.name ? (
          <>
            <Flex align='center' justify='center'>
              <Heading
                w={275}
                size='md'
                mb={2}
                textAlign='center'
                whiteSpace='nowrap'
                overflow='hidden'
                textOverflow='ellipsis'
              >
                {room.name}
              </Heading>
              {/* <Tooltip label='Favorite room' aria-label='Favorite room'>
                <Box ml={2}>
                  <FaRegHeart />
                </Box>
              </Tooltip> */}
            </Flex>
            <Flex>
              <Link href='/dashboard'>
                <a>
                  <Button
                    colorScheme='red'
                    leftIcon={<FaSignOutAlt />}
                    size='sm'
                    onClick={handleLeaveRoom}
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
