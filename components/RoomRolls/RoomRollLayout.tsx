import React from 'react';
import { Box, Grid } from '@chakra-ui/core';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const RoomRollLayout = ({ children }: Props) => {
  return (
    <Box>
      <Grid
        mt={[0, 0, 8, 8]}
        templateColumns={[
          'repeat(auto-fill, minmax(260px, 1fr))',
          'repeat(auto-fill, minmax(280px, 1fr))',
          'repeat(auto-fill, minmax(300px, 1fr))',
          'repeat(auto-fill, minmax(300px, 1fr))',
        ]}
        templateRows='1fr'
        gap={4}
        alignItems='stretch'
        justifyContent='stretch'
      >
        {children}
      </Grid>
    </Box>
  );
};

export default RoomRollLayout;
