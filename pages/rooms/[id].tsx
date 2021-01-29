import React, { useEffect } from 'react';
import {
  Flex,
  Grid,
  Button,
  Icon,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Box,
} from '@chakra-ui/react';
import ChatComponent from '../../components/Room/Chat/ChatComponent';
import useBackgroundColor from '../../hooks/useBackgroundColor';
import PlaybackHeader from '../../components/PlaybackHeader/PlaybackHeader';
import DashboardBottomBar from '../../components/Room/DashboardBottomBar';
import ListenerPanel from '../../components/Room/Listeners/ListenerPanel';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import Layout from '../../components/Layout';

interface Props {}

export const Room = (props: Props) => {
  const router = useRouter();
  const id = router.query.id;

  const [modal, setModal] = useAtom(modalAtom);

  const { foregroundColor, backgroundColor } = useBackgroundColor();

  useEffect(
    () => {
      // const initializeRoom = async (room: RoomInformation) => {
      //   if (userInformation) {
      //     setRoomInformation(room);
      //     await addUserToRoom(room, userInformation);
      //   }
      // };
      // if (!loading && !error && value) {
      //   if (value.exists) {
      //     const room = value.data();
      //     if (!roomInformation) initializeRoom(room as RoomInformation);
      //   }
      // }
    },
    [
      // value,
      // loading,
      // error,
      // userInformation,
      // setRoomInformation,
      // roomInformation,
    ]
  );

  console.log(modal);

  return (
    <Layout>
      <Box h='100vh'>
        <PlaybackHeader />
        <Grid
          gridTemplateColumns={['1fr', '1fr', '350px 1fr', '350px 1fr']}
          flex={1}
          bg={backgroundColor}
          position='relative'
        >
          <Flex
            bg={foregroundColor}
            pt={24}
            position='fixed'
            left={0}
            w={['100%', '100%', '350px', '350px']}
            h='100%'
          >
            <Tabs
              pt={4}
              flex={1}
              variant='solid-rounded'
              variantColor='green'
              display='flex'
              flexDirection='column'
              size='md'
            >
              {/* {roomInformation ? ( */}
              <Flex
                align='center'
                justify='space-between'
                mb={4}
                px={4}
                direction='row'
              >
                <TabList>
                  <Tab>Queue</Tab>
                  <Tab ml={1}>Listeners</Tab>
                  <Tab ml={1} display={['block', 'block', 'none', 'none']}>
                    Chat
                  </Tab>
                </TabList>
                <Tooltip
                  placement='right'
                  label='Queue Song'
                  aria-label='Queue Song'
                  hasArrow
                >
                  <Button
                    variant='ghost'
                    onClick={() => setModal(Modal.QueueSong)}
                    display={[
                      'none',
                      'inline-block',
                      'inline-block',
                      'inline-block',
                    ]}
                    // isDisabled={!roomInformation}
                  >
                    <FiPlus />
                  </Button>
                </Tooltip>
              </Flex>
              {/* ) : (
              <></>
            )} */}
              <TabPanels flex={1}>
                <TabPanel px={4}>
                  <Box></Box>
                </TabPanel>
                <TabPanel px={4}>{/* <ListenerPanel /> */}</TabPanel>
                <TabPanel
                  overflowY='scroll'
                  h='100%'
                  maxH='75vh'
                  bg={backgroundColor}
                >
                  <ChatComponent type='panel' />
                </TabPanel>
              </TabPanels>
              {/* <DashboardBottomBar /> */}
            </Tabs>
          </Flex>
          <Box
            gridColumn='2/3'
            minH='100vh'
            pt={24}
            display={['none', 'none', 'block', 'block']}
          >
            <ChatComponent type='full' />
          </Box>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Room;
