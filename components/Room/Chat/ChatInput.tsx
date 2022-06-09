import { Input, useToast } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { roomAtom } from '../../../state/roomAtom';
import { userAtom } from '../../../state/userAtom';
import { useForm } from 'react-hook-form';
import { styled } from '@stitches/react';

interface Props {}

const StyledForm = styled('form', {
  width: '100%',
  height: '4rem',
  padding: '0 1rem',
  zIndex: 1,
  display: 'grid',
  placeItems: 'center',
});

const StyledInput = styled(Input, {});

const ChatInput = ({}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [room] = useAtom(roomAtom);
  const [user] = useAtom(userAtom);
  const toast = useToast();

  const onSubmit = async (data) => {
    const { message } = data;

    try {
      await fetch('/api/rooms/chat', {
        method: 'POST',
        body: JSON.stringify({ message, room_id: room.id, user_id: user.id }),
      });

      toast({
        title: `Message "${message}" sent!`,
        status: 'success',
        position: 'bottom-right',
      });
    } catch {
      console.error('Error sending chat message.');
    }
    reset();
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledInput
        isDisabled={!room.name}
        type='text'
        name='message'
        placeholder='Send a message...'
        {...register('message')}
      />
    </StyledForm>
  );
};

export default ChatInput;
