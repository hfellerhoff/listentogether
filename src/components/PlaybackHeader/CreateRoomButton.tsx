import { useState } from 'react';

import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';

import { useAuthContext } from '@/lib/AuthProvider';
import { useProfileContext } from '@/lib/UserProvider';
import { trpc } from 'src/server/client';

export default function CreateRoomButton() {
  const router = useRouter();
  const { session } = useAuthContext();
  const { user } = useProfileContext();

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isRoomCreationModalOpen, setIsRoomCreationModalOpen] = useState(false);
  const { mutateAsync: createRoom } = trpc.createRoom.useMutation();

  const { register, handleSubmit } = useForm();

  const onCreateRoom = handleSubmit(async ({ name, visibility }) => {
    if (!user || !session) return;

    setIsCreatingRoom(true);

    const room = await createRoom({
      name,
      visibility,
      creator_id: session.user.id,
    });

    if (room) router.push(`/rooms/${room.slug}`);

    setIsCreatingRoom(false);
    closeModal();
  });

  const openModal = () => setIsRoomCreationModalOpen(true);
  const closeModal = () => setIsRoomCreationModalOpen(false);

  return (
    <>
      <Button
        colorScheme='green'
        leftIcon={<FiPlus />}
        onClick={openModal}
        isLoading={isCreatingRoom}
      >
        Create Room
      </Button>
      <Modal isOpen={isRoomCreationModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <form onSubmit={onCreateRoom}>
          <ModalContent>
            <ModalHeader>Create Room</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>Room Name</FormLabel>
              <Input
                defaultValue={
                  user?.displayName
                    ? `${user?.displayName}'s Room`
                    : 'My New Room'
                }
                {...register('name')}
              />
              <FormLabel className='mt-6'>Room Visibility</FormLabel>
              <RadioGroup defaultValue='public' className='-mt-3'>
                <Stack spacing={0}>
                  <Radio
                    colorScheme='green'
                    value='public'
                    size='lg'
                    {...register('visibility')}
                  >
                    <p className='pt-3 pl-1 text-base font-bold'>Public</p>
                    <p className='pl-1 text-sm'>Any user can join your room</p>
                  </Radio>
                  <Radio
                    colorScheme='green'
                    value='private'
                    size='lg'
                    {...register('visibility')}
                  >
                    <p className='pt-3 pl-1 text-base font-bold'>Private</p>
                    <p className='pl-1 text-sm'>
                      Users can only join with a room code
                    </p>
                  </Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>

            <ModalFooter justifyContent='space-between'>
              <Button variant='outline' onClick={closeModal}>
                Cancel
              </Button>
              <Button colorScheme='green' mr={3} type='submit'>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
