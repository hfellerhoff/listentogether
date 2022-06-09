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
import useGradientsFromImageRef from '../../hooks/useGradientsFromImageRef';
import { useRouter } from 'next/router';
import Song from '../../models/Song';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';

interface Props {
  room: Room;
}

const RoomCardDisplay = ({ room }: Props) => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [owner, setOwner] = useState<User>();
  const [song, setSong] = useState<Song>();
  const track = useSpotifyTrack(song);

  const { normalGradient, hoverGradient } = useGradientsFromImageRef(
    track ? track.album.images[0].url : undefined
  );

  useEffect(() => {
    if (!room) return;

    const fetchOwner = async () => {
      let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', room.owner_id)
        .range(0, 1);

      if (!users) return;
      if (users.length > 0) setOwner(user[0]);
    };

    fetchOwner();
  }, [room]);

  useEffect(() => {
    if (!room) return;

    const fetchSong = async () => {
      let { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .order('addedAt', { ascending: true })
        .eq('room_id', room.id)
        .range(0, 1);

      if (songs.length > 0) {
        setSong(songs[0]);
      }
    };

    fetchSong();
  }, [room]);

  return (
    <Box
      borderRadius={4}
      h='100%'
      bg={track ? normalGradient : 'gray.700'}
      p={[4, 6, 8, 8]}
      _hover={{
        background: track ? hoverGradient : 'gray.600',
      }}
      onClick={async () => router.push(`/rooms/${room.slug}`)}
      textAlign='center'
      color='#ffffff'
      position='relative'
      cursor='pointer'
    >
      <Heading size='lg' textShadow='0px 2px #2F2F2F'>
        <Text>{room.name}</Text>
      </Heading>
      {track ? (
        <Box mt={4}>
          <DashboardSongDisplay
            title={track.name}
            artist={track.artists[0].name}
            album={track.album.name}
            src={track.album.images[0].url}
            // imageRef={image}
            standalone
          />
        </Box>
      ) : (
        <Box mt={4}>
          <Flex align='center' justify='center' p={12}>
            <FiMusic fontSize={48} />
          </Flex>
          <Text>Be the first to play something!</Text>
        </Box>
      )}
      {/* <Box height={4} /> */}
      {/*<Flex
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
            <Tooltip label='Your room' aria-label='Your room' placement='top'>
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
      </Flex> */}
    </Box>
  );
};

export default RoomCardDisplay;
