import React from 'react';

import { Button, Input } from '@chakra-ui/react';
import { styled } from '@stitches/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const Container = styled('div', {
  display: 'grid',
  placeItems: 'center',
});

const FormContainer = styled('form', {
  display: 'flex',
  marginTop: '0.5rem',
});

const JoinWithRoomCode = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const handleNavigate = handleSubmit(({ slug }) => {
    router.push(`/rooms/${slug.trim()}`);
  });

  return (
    <Container>
      <label htmlFor='input-room_code'>
        Have a room code? Join a room with it:
      </label>
      <FormContainer onSubmit={handleNavigate}>
        <Input
          id='input-room_code'
          placeholder='XXXXXXXXXX'
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
