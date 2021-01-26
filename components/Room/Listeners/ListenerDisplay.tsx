import React from 'react';
import { Flex, Avatar, Text } from '@chakra-ui/core';
import { UserInformationRoom } from '../../../models/UserInformation';

interface Props {
  user: UserInformationRoom;
}

const ListenersDisplay = ({ user }: Props) => {
  return (
    <Flex align='center'>
      <Avatar size='sm' name={user.displayName} src={user.image.src} />
      <Text ml={2}>{user.displayName}</Text>
    </Flex>
  );
};

export default ListenersDisplay;
