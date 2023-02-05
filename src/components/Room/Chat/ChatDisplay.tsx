import { styled } from '@stitches/react';

import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import ChatMessageDisplay from './ChatMessageDisplay';
import Message from '../../../models/Message';

interface Props {
  messages: Message[];
}

const Container = styled('div', {});

const ChatDisplay = ({ messages }: Props) => {
  let lastMessage = 0;
  return (
    <Container>
      {messages &&
        messages.map((message, index) => {
          const id = lastMessage;
          lastMessage = message.author_id;

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
    </Container>
  );
};

export default ChatDisplay;
