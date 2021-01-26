import React from 'react';
import { Box, Flex, Avatar, Text, useColorMode } from '@chakra-ui/core';
import { ChatMessage } from '../../../models/ChatMessage';

interface Props {
  messages: ChatMessage[];
}

const ChatDisplay = ({ messages }: Props) => {
  const { colorMode } = useColorMode();

  return (
    <Box flex={1} overflowY='scroll' h='100%' pb={6}>
      {messages.map((message, index) => {
        const isMessage = message.type === 'message';
        const isSameUser =
          index !== 0 ? message.user.id === messages[index - 1].user.id : false;

        return (
          <Flex
            bg={
              isMessage
                ? 'transparent'
                : colorMode === 'light'
                ? '#E0E5EA'
                : '#12141C'
            }
            mt={index === 0 ? 0 : isSameUser ? 1 : 2}
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
                    width={8}
                    height={8}
                    size='sm'
                    src={message.user.image.src}
                    name={message.user.displayName}
                  />
                )}
                <Box ml={isSameUser ? 10 : 2}>
                  <Text fontSize={12} display={isSameUser ? 'none' : 'block'}>
                    {message.user.displayName}
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
      })}
    </Box>
  );
};

export default ChatDisplay;
