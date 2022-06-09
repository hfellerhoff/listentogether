import { Box, Flex, Heading, Stack, Text, Image } from '@chakra-ui/react';
import React from 'react';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import Song from '../../models/Song';

interface Props {
  song: Song;
}

const QueuedSongDisplay = ({ song }: Props) => {
  const track = useSpotifyTrack(song);

  if (!track)
    return (
      <Stack align='center'>
        <Spinner />
      </Stack>
    );

  return (
    <Flex align='center'>
      <Image width={12} height={12} src={track.album.images[0].url} />
      <Box ml={2}>
        <Heading size='sm'>{track.name}</Heading>
        <Text>{track.artists[0].name}</Text>
      </Box>
    </Flex>
  );
};

export default QueuedSongDisplay;
