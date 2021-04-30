import { Avatar, Box, Flex, useColorMode, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Message, { MessageType } from '../../../models/Message';
import User from '../../../models/User';
import supabase from '../../../util/supabase';

interface Props {
  message: Message;
  index: number;
  previousUser: number;
}

const ChatMessageDisplay = ({ message, index, previousUser }: Props) => {
  const isMessage = message.type === MessageType.UserChat;
  const { colorMode } = useColorMode();
  const isSameUser = message.user_id === previousUser;

  console.log(isSameUser, message.user_id, previousUser);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const updateUser = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', message.user_id);

      setUser(data[0]);
    };

    if (message && !isSameUser) updateUser();
  }, [message, isSameUser]);

  return (
    <Flex
      bg={
        isMessage
          ? 'transparent'
          : colorMode === 'light'
          ? '#E0E5EA'
          : '#12141C'
      }
      mt={isSameUser ? -1 : 4}
      px={4}
      py={isMessage ? 1 : 4}
      align={isMessage ? 'flex-start' : 'center'}
      justify={isMessage ? 'flex-start' : 'center'}
      key={index}
    >
      {isMessage ? (
        <>
          {isSameUser ? (
            <></>
          ) : (
            <Avatar
              width={9}
              height={9}
              size='sm'
              src={user && user.imageSrc}
              name={user ? user.name : ''}
            />
          )}
          <Box ml={isSameUser ? 12 : 3}>
            <Text fontSize={12} display={isSameUser ? 'none' : 'block'}>
              {user ? user.name : ''}
            </Text>
            <Text>{message.content}</Text>
          </Box>
        </>
      ) : (
        <>
          <Text textAlign='center'>{message.content}</Text>
        </>
      )}
    </Flex>
  );
};

export default ChatMessageDisplay;
