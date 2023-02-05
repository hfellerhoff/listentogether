import { Input } from '@chakra-ui/react';
import { styled } from '@stitches/react';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';

import { useAuthContext } from '@/lib/AuthProvider';
import { MessageType } from 'src/models/Message';
import { trpc } from 'src/server/client';

import { roomAtom } from '../../../state/roomAtom';

const StyledForm = styled('form', {
  width: '100%',
  height: '4rem',
  padding: '0 1rem',
  zIndex: 1,
  display: 'grid',
  placeItems: 'center',
});

const StyledInput = styled(Input, {});

const ChatInput = () => {
  const { register, handleSubmit, reset } = useForm();
  const [room] = useAtom(roomAtom);
  const { session } = useAuthContext();
  const { mutateAsync: sendChatMessage } = trpc.sendChatMessage.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    const { message } = data;

    if (!session?.user) return;

    try {
      await sendChatMessage({
        type: MessageType.UserChat,
        content: message,
        room_id: room.id,
        author_id: session.user.id,
      });
    } catch {
      console.error('Error sending chat message.');
    }
    reset();
  });

  return (
    <StyledForm onSubmit={onSubmit}>
      <StyledInput
        isDisabled={!room.name}
        type='text'
        placeholder='Send a message...'
        {...register('message')}
      />
    </StyledForm>
  );
};

export default ChatInput;
