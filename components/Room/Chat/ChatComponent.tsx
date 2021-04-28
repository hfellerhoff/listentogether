import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';
import useBackgroundColor from '../../../hooks/useBackgroundColor';
import Message from '../../../models/Message';
import useMessages from '../../../hooks/supabase/useMessages';
import { useAtom } from 'jotai';
import { roomAtom } from '../../../state/roomAtom';

export type ChatComponentType = 'panel' | 'full';

interface Props {
  type: ChatComponentType;
}

const ChatComponent = ({ type }: Props) => {
  const { backgroundColor } = useBackgroundColor();
  const [room] = useAtom(roomAtom);

  const messages = useMessages(room.id);
  console.log(messages);

  const display = {
    full: ['none', 'none', 'flex', 'flex'],
    panel: ['flex', 'flex', 'none', 'none'],
  };

  return (
    <Flex
      bg={backgroundColor}
      direction='column'
      display={display[type]}
      maxH='100%'
      bottom={0}
    >
      <ChatDisplay messages={messages.array} />
      <Box height={20} />
      <ChatInput type={type} />
    </Flex>
  );
};

export default ChatComponent;
