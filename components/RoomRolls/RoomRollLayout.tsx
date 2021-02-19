import React from 'react';
import { Box, Grid } from '@chakra-ui/react';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const RoomRollLayout = ({ children }: Props) => {
  return (
    <Box width='100%'>
      <Grid
        mt={[4, 4, 8, 8]}
        px={[4, 4, 0]}
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
