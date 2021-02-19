import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import DashboardWelcome from '../../components/Dashboard/DashboardWelcome';
import Layout from '../../components/Layout';
import PlaybackHeader from '../../components/PlaybackHeader/PlaybackHeader';
import PublicRoomRoll from '../../components/RoomRolls/PublicRoomRoll';

interface Props {}

const Dashboard = (props: Props) => {
  return (
    <Layout>
      <Head>
        <title>Dashboard / Listen Together</title>
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
          {/* <DashboardFavoritedRooms rooms={rooms} isLoading={isLoading} /> */}
          <PublicRoomRoll />
        </Flex>
      </Box>
    </Layout>
  );
};

export default Dashboard;
