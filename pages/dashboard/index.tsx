import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import DashboardWelcome from '../../components/Dashboard/DashboardWelcome';
import Layout from '../../components/Layout';
import PlaybackHeader from '../../components/PlaybackHeader/PlaybackHeader';

interface Props {}

const Dashboard = (props: Props) => {
  return (
    <Layout>
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
          {/* <DashboardFavoritedRooms rooms={rooms} isLoading={isLoading} />
              <DashboardPublicRooms rooms={rooms} isLoading={isLoading} /> */}
        </Flex>
      </Box>
    </Layout>
  );
};

export default Dashboard;
