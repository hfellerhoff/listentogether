import React from 'react';
import { Box, Input } from '@chakra-ui/core';
import useBackgroundColor from '../../../hooks/useBackgroundColor';
import { ChatComponentType } from './ChatComponent';
import { useRecoilValue } from 'recoil';
import sendChatMessage from '../../../services/sendChatMessage';
import { roomInformationState } from '../../../state/roomInformation';
import { Formik } from 'formik';
import { MessagesDocument } from '../../../models/room-details/MessagesDocument';
import { userInformationState } from '../../../state/userInformation';

interface Props {
  type: ChatComponentType;
  messageDocument: MessagesDocument | undefined;
}

const ChatInput = ({ type, messageDocument }: Props) => {
  const { foregroundColor } = useBackgroundColor();
  const userInformation = useRecoilValue(userInformationState);
  const roomInformation = useRecoilValue(roomInformationState);
  const isPanel = type === 'panel';

  const onSubmit = (content: string) => {
    if (userInformation && roomInformation && messageDocument) {
      sendChatMessage(
        messageDocument,
        roomInformation.id,
        userInformation,
        content
      );
    }
  };

  return (
    <Box
      bg={foregroundColor}
      pt={4}
      pl={isPanel ? [4, 4, 4, 4] : 4}
      pr={isPanel ? [4, 4, 4, 4] : 4}
      pb={isPanel ? [3, 4, 4, 4] : 4}
      position='fixed'
      width={isPanel ? '100%' : 'calc(100% - 350px)'}
      bottom={0}
      right={0}
    >
      <Formik
        initialValues={{ message: '' }}
        onSubmit={(values, actions) => {
          onSubmit(values.message);
          actions.resetForm();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Input
              isDisabled={!roomInformation}
              type='text'
              name='message'
              variant='filled'
              placeholder='Send a message...'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.message}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ChatInput;
