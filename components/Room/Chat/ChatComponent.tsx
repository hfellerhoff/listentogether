import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/core';
import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';
import useBackgroundColor from '../../../hooks/useBackgroundColor';
import { ChatMessage } from '../../../models/ChatMessage';
import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from '../../../lib/firebase';
import { MessagesDocument } from '../../../models/room-details/MessagesDocument';
import { useRecoilValue } from 'recoil';
import { roomInformationState } from '../../../state/roomInformation';

export type ChatComponentType = 'panel' | 'full';

interface Props {
  type: ChatComponentType;
}

const ChatComponent = ({ type }: Props) => {
  const { backgroundColor } = useBackgroundColor();
  const roomInformation = useRecoilValue(roomInformationState);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [snapshot, loading, error] = useDocument(
    roomInformation
      ? firebase
          .firestore()
          .collection('rooms')
          .doc(roomInformation.id)
          .collection('details')
          .doc('messages')
      : null
  );

  useEffect(() => {
    if (snapshot && !loading && !error) {
      const document = snapshot.data() as MessagesDocument;
      const unsortedMessages = Object.values(document.messages);

      const sortedMessages = unsortedMessages.sort((a, b) => {
        const timestampA = a.timestamp
          ? (a.timestamp as firebase.firestore.Timestamp).toDate().getTime()
          : 0;
        const timestampB = b.timestamp
          ? (b.timestamp as firebase.firestore.Timestamp).toDate().getTime()
          : 0;

        if (timestampA < timestampB) return -1;
        else if (timestampA > timestampB) return 1;
        return 0;
      });

      setMessages(sortedMessages);
    }
  }, [snapshot, loading, error]);

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
      <ChatDisplay messages={messages} />
      <Box height={20} />
      <ChatInput
        type={type}
        messageDocument={
          snapshot ? (snapshot.data() as MessagesDocument) : undefined
        }
      />
    </Flex>
  );
};

export default ChatComponent;
