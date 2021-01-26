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
} from '@chakra-ui/core';
import { useRecoilValue, useRecoilState } from 'recoil';
import { roomInformationState } from '../../state/roomInformation';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import { useHistory } from 'react-router-dom';
import { FiLogOut, FiCopy } from 'react-icons/fi';
import { userInformationState } from '../../state/userInformation';
import removeUserFromRoom from '../../services/removeUserFromRoom';
import LinesEllipsis from 'react-lines-ellipsis';
import FavoriteRoomButton from '../Buttons/FavoriteRoomButton';

interface Props {}

const DashboardBottomBar = (props: Props) => {
  const history = useHistory();
  const { foregroundColor } = useBackgroundColor();
  const [roomInformation, setRoomInformation] = useRecoilState(
    roomInformationState
  );
  const userInformation = useRecoilValue(userInformationState);
  const { onCopy, hasCopied } = useClipboard(
    roomInformation ? roomInformation.id : ''
  );

  const isFavorited =
    userInformation && roomInformation
      ? userInformation.favoritedRoomIDs.includes(roomInformation.id)
      : false;
  const favoriteText = isFavorited ? 'Unfavorite Room' : 'Favorite Room';

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
        {roomInformation ? (
          <>
            <Flex align='center' justify='center'>
              <Heading size='lg' mb={2} textAlign='center'>
                <LinesEllipsis
                  text={roomInformation.name}
                  maxLine='2'
                  ellipsis='...'
                  trimRight
                  basedOn='letters'
                />
              </Heading>
              <Tooltip label={favoriteText} aria-label={favoriteText}>
                <Box ml={2}>
                  <FavoriteRoomButton room={roomInformation} />
                </Box>
              </Tooltip>
            </Flex>
            <Flex>
              <Button
                variantColor='blue'
                leftIcon={() => <FiCopy />}
                size='sm'
                onClick={onCopy}
                mr={2}
              >
                <Text ml={2}>{hasCopied ? 'Copied!' : 'Copy ID'}</Text>
              </Button>
              <Button
                variantColor='red'
                leftIcon={() => <FiLogOut />}
                size='sm'
                onClick={async () => {
                  if (userInformation && roomInformation) {
                    await removeUserFromRoom(roomInformation, userInformation);
                    setRoomInformation(null);
                    history.push('/dashboard');
                  }
                }}
              >
                <Text ml={2}>Leave</Text>
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Heading size='md' mb={2}>
              No room selected.
            </Heading>
            <Button
              variantColor='red'
              leftIcon={() => <FiLogOut />}
              size='sm'
              onClick={() => {
                history.push('/dashboard');
              }}
            >
              <Text ml={2}>Back to Home</Text>
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardBottomBar;
