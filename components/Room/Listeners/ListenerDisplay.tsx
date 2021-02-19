import React from 'react';
import { Flex, Avatar, Text } from '@chakra-ui/react';
import User from '../../../models/User';

interface Props {
  user: User;
}

const ListenersDisplay = ({ user }: Props) => {
  return (
    <Flex align='center'>
      <Avatar size='sm' name={user.name} src={user.imageSrc} />
      <Text ml={2}>{user.name}</Text>
    </Flex>
  );
};

export default ListenersDisplay;
