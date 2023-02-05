import { useEffect, useState } from 'react';

import { Text } from '@chakra-ui/react';
import { styled } from '@stitches/react';
import dayjs from 'dayjs';

import { SupabaseProfile } from 'src/models/Profile';

import Message, { MessageType } from '../../../models/Message';
import supabase from '../../../util/supabase';
import Avatar from '../../Avatar';

interface Props {
  message: Message;
  index: number;
  previousUser: number;
}

const Container = styled('div', {
  display: 'flex',
  marginTop: '1rem',
  padding: '0.25rem 1rem',

  variants: {
    isServer: {
      true: {
        background: '$neutral2',
        padding: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    isSameUser: {
      true: {
        marginTop: '0.25rem',
      },
    },
  },
});

const MessageContainer = styled('div', {
  marginLeft: '1rem',
  variants: {
    isServer: {
      true: {},
    },
    isSameUser: {
      true: {
        marginLeft: '3.5rem',
      },
    },
  },
});

const ChatMessageDisplay = ({ message, index, previousUser }: Props) => {
  const isUserChat = message.type === MessageType.UserChat;
  const isSameUser = message.author_id === previousUser;

  const [user, setUser] = useState<SupabaseProfile>();

  useEffect(() => {
    const updateUser = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', message.author_id);

      if (data?.length) setUser(data[0]);
    };

    if (message && !isSameUser) updateUser();
  }, [message, isSameUser]);

  const displayName = user?.display_name || '';
  const avatarUrl = user?.service_avatar_url || '';

  return (
    <Container isServer={!isUserChat} isSameUser={isSameUser} key={index}>
      {isUserChat ? (
        <>
          {!isSameUser && <Avatar src={avatarUrl} name={displayName} />}
          <MessageContainer isSameUser={isSameUser}>
            <Text fontSize={12} display={isSameUser ? 'none' : 'block'}>
              {displayName} •{' '}
              {dayjs(message.timestamp).format('MMM D, YYYY • hh:mma')}
            </Text>
            <Text>{message.content}</Text>
          </MessageContainer>
        </>
      ) : (
        <Text textAlign='center'>{message.content}</Text>
      )}
    </Container>
  );
};

export default ChatMessageDisplay;
