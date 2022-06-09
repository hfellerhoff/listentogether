import { Button, Input } from '@chakra-ui/react';
import { styled } from '@stitches/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {};

const Container = styled('div', {
  display: 'grid',
  placeItems: 'center',
});

const FormContainer = styled('form', {
  display: 'flex',
  marginTop: '0.5rem',
});

const JoinWithRoomCode = (props: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleNavigate = ({ slug }) => {
    router.push(`/rooms/${slug.trim()}`);
  };

  return (
    <Container>
      <label htmlFor='input-room_code'>
        Have a room code? Join a room with it:
      </label>
      <FormContainer onSubmit={handleSubmit(handleNavigate)}>
        <Input
          id='input-room_code'
          background='white'
          placeholder='XXXXXXXXX'
          w={40}
          textAlign='center'
          {...register('slug')}
        />
        <Button colorScheme='green' ml={2} type='submit'>
          Join
        </Button>
      </FormContainer>
    </Container>
  );
};

export default JoinWithRoomCode;
