import { useEffect, useState } from 'react';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiMusic, FiYoutube } from 'react-icons/fi';

import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import useGradientsFromImageRef from '../../hooks/useGradientsFromImageRef';
import Room from '../../models/Room';
import Song from '../../models/Song';
import supabase from '../../util/supabase';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';

interface Props {
  room: Room;
}

const RoomCardDisplay = ({ room }: Props) => {
  const router = useRouter();

  // const [owner, setOwner] = useState<User>();
  const [song, setSong] = useState<Song>();
  const track = useSpotifyTrack(song);

  const { normalGradient, hoverGradient } = useGradientsFromImageRef(
    track ? track.album.images[0].url : undefined
  );

  // useEffect(() => {
  //   if (!room) return;

  //   const fetchOwner = async () => {
  //     const { data: users, error } = await supabase
  //       .from('users')
  //       .select('*')
  //       .eq('id', room.owner_id)
  //       .range(0, 1);

  //     if (!users) return;
  //     if (users.length > 0) setOwner(user[0]);
  //   };

  //   fetchOwner();
  // }, [room]);

  useEffect(() => {
    if (!room) return;

    const fetchSong = async () => {
      const { data: songs } = await supabase
        .from('songs')
        .select('*')
        .order('addedAt', { ascending: true })
        .eq('room_id', room.id)
        .range(0, 1);

      if (songs && songs.length > 0) {
        setSong(songs[0]);
      }
    };

    fetchSong();
  }, [room]);

  return (
    <Box
      borderRadius={4}
      h='100%'
      bg={track ? normalGradient : song ? 'maroon' : 'gray.700'}
      p={[4, 6, 8, 8]}
      _hover={{
        background: track ? hoverGradient : song ? '#990000' : 'gray.600',
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
      ) : song ? (
        <Box mt={4}>
          <Flex align='center' justify='center' p={12}>
            <FiYoutube fontSize={48} />
          </Flex>
          <Text>Listening to a YouTube video</Text>
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
