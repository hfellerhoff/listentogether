import React from 'react';
import { Box, Flex, Avatar, Text, useColorMode } from '@chakra-ui/react';
import Message, { MessageType } from '../../../models/Message';
import ChatMessageDisplay from './ChatMessageDisplay';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';

interface Props {
  messages: Message[];
}

const ChatDisplay = ({ messages }: Props) => {
  const { colorMode } = useColorMode();

  let lastMessage = 0;
  return (
    <Box flex={1} overflowY='scroll' h='100%' pb={6}>
      {messages &&
        messages.map((message, index) => {
          const id = lastMessage;
          lastMessage = message.user_id;

          return (
            <ChatMessageDisplay
              message={message}
              previousUser={id}
              index={index}
              key={index}
            />
          );
        })}
      <AlwaysScrollToBottom />
    </Box>
  );
};

export default ChatDisplay;
