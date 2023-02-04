import { Flex } from '@chakra-ui/react';

const ListenerPanel = () => {
  // const roomInformation = useRecoilValue(roomInformationState);
  // const [listeners, setListeners] = useState<
  //   UserInformationRoom[] | undefined
  // >();

  // const [value, loading, error] = useDocument(
  //   roomInformation
  //     ? firebase
  //         .firestore()
  //         .collection('rooms')
  //         .doc(roomInformation.id)
  //         .collection('details')
  //         .doc('listeners')
  //     : null
  // );

  // useEffect(() => {
  //   if (!loading && !error && value) {
  //     if (value.exists) {
  //       const document = value.data() as ListenersDocument;
  //       setListeners(Object.values(document.listeners));
  //     }
  //   }
  // }, [value, loading, error, roomInformation]);

  return (
    <Flex direction='column'>
      {/* {listeners ? (
        listeners.map((listener) => <ListenerDisplay user={listener} />)
      ) : (
        <Spinner />
      )} */}
    </Flex>
  );
};

export default ListenerPanel;
