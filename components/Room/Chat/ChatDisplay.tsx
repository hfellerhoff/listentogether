import React from 'react';
import { Box, Flex, Avatar, Text, useColorMode } from '@chakra-ui/react';
import Message, { MessageType } from '../../../models/Message';
import ChatMessageDisplay from './ChatMessageDisplay';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import { styled } from '@stitches/react';

interface Props {
  messages: Message[];
}

const Container = styled('div', {});

const ChatDisplay = ({ messages }: Props) => {
  const { colorMode } = useColorMode();

  let lastMessage = 0;
  return (
    <Container>
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
      {/* <AlwaysScrollToBottom /> */}
    </Container>
  );
};

export default ChatDisplay;
