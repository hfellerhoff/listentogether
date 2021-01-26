import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { roomInformationState } from '../../../state/roomInformation';
import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from '../../../lib/firebase';
import { ListenersDocument } from '../../../models/room-details/ListenersDocument';
import { Spinner, Flex } from '@chakra-ui/core';
import { UserInformationRoom } from '../../../models/UserInformation';
import ListenerDisplay from './ListenerDisplay';

interface Props {}

const ListenerPanel = (props: Props) => {
  const roomInformation = useRecoilValue(roomInformationState);
  const [listeners, setListeners] = useState<
    UserInformationRoom[] | undefined
  >();

  const [value, loading, error] = useDocument(
    roomInformation
      ? firebase
          .firestore()
          .collection('rooms')
          .doc(roomInformation.id)
          .collection('details')
          .doc('listeners')
      : null
  );

  useEffect(() => {
    if (!loading && !error && value) {
      if (value.exists) {
        const document = value.data() as ListenersDocument;
        setListeners(Object.values(document.listeners));
      }
    }
  }, [value, loading, error, roomInformation]);

  return (
    <Flex direction='column'>
      {listeners ? (
        listeners.map((listener) => <ListenerDisplay user={listener} />)
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

export default ListenerPanel;
