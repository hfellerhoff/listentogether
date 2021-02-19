import React, { useEffect, useRef, useState } from 'react';
import { Heading, Box, Text, Flex, Tooltip } from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { FiMusic, FiUser } from 'react-icons/fi';
import { FaCrown, FaHeart, FaRegHeart } from 'react-icons/fa';
import Room from '../../models/Room';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/userAtom';
import User from '../../models/User';
import supabase from '../../util/supabase';
import Link from 'next/link';

interface Props {
  room: Room;
}

const RoomCardDisplay = ({ room }: Props) => {
  // const history = useHistory();
  const [user] = useAtom(userAtom);
  const [owner, setOwner] = useState<User>();

  useEffect(() => {
    const fetchOwner = async () => {
      console.log(room);

      let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', room.owner_id)
        .range(0, 1);
      console.log(users, error);
      if (users.length > 0) setOwner(user[0]);
    };

    fetchOwner();
  }, []);

  const image = useRef<HTMLImageElement>();
  // const [normalGradient, hoverGradient] = useGradientsFromImageRef(image);

  console.log(room);

  return (
    <Link href={`rooms/${room.slug}`}>
      <a>
        <Box
          borderRadius={4}
          h='100%'
          // background={normalGradient}
          bg='gray.700'
          p={[4, 6, 8, 8]}
          // _hover={{
          //   background: hoverGradient,
          // }}
          // onClick={async () => {
          //   history.push(`/rooms/${room.id}`);
          // }}
          textAlign='center'
          color='#ffffff'
          position='relative'
        >
          <Heading size='lg' textShadow='0px 2px #2F2F2F'>
            <Text>{room.name}</Text>
          </Heading>
          {false ? (
            <Box mt={4}>
              {/* <DashboardSongDisplay
            title={room.currentSong.name}
            artist={room.currentSong.artists[0]}
            album={room.currentSong.album.name}
            src={room.currentSong.album.image.src}
            standalone
            imageRef={image}
          /> */}
            </Box>
          ) : (
            <Box mt={4}>
              <Flex align='center' justify='center' p={12}>
                <FiMusic fontSize={48} />
              </Flex>
              <Text>Be the first to play something!</Text>
            </Box>
          )}
          <Box height={12} />
          <Flex
            align='center'
            justify='center'
            position='absolute'
            bottom={6}
            left={0}
            width='100%'
          >
            <Tooltip
              label='Current listeners'
              aria-label='Current listeners'
              placement='top'
            >
              <Flex align='center' justify='center' flex={1}>
                <FiUser fontSize={20} />
                <Text fontSize={20} ml={2}>
                  0
                </Text>
              </Flex>
            </Tooltip>
            {user && owner ? (
              owner.id === user.id ? (
                <Tooltip
                  label='Your room'
                  aria-label='Your room'
                  placement='top'
                >
                  <Flex align='center' justify='center' mx={2}>
                    <FaCrown fontSize={24} />
                  </Flex>
                </Tooltip>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            <Tooltip label='Favorites' aria-label='Favorites' placement='top'>
              <Flex align='center' justify='center' flex={1}>
                <FaRegHeart />
                <Text fontSize={20} ml={2}>
                  0
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
        </Box>
      </a>
    </Link>
  );
};

export default RoomCardDisplay;
