import React from 'react';
import { Box, Flex, Avatar, Text, useColorMode } from '@chakra-ui/react';
import Message, { MessageType } from '../../../models/Message';
import ChatMessageDisplay from './ChatMessageDisplay';

interface Props {
  messages: Message[];
}

const ChatDisplay = ({ messages }: Props) => {
  const { colorMode } = useColorMode();

  return (
    <Box flex={1} overflowY='scroll' h='100%' pb={6}>
      {messages &&
        messages.map((message, index) => (
          <ChatMessageDisplay message={message} index={index} />
        ))}
    </Box>
  );
};

export default ChatDisplay;
