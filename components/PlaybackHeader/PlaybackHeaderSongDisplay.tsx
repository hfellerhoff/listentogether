import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { roomAtom } from '../../state/roomAtom';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from '../../hooks/useSpotifyAuthentication';
import Song from '../../models/Song';
import { FaPlus } from 'react-icons/fa';

interface Props {
  song?: Song;
}

const PlaybackHeaderSongDisplay = ({ song }: Props) => {
  const [room] = useAtom(roomAtom);
  const [, setModal] = useAtom(modalAtom);
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();
  const [
    spotifyTrack,
    setSpotifyTrack,
  ] = useState<SpotifyApi.SingleTrackResponse>();

  useEffect(() => {
    if (song) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getTrack(song.spotifyUri.split(':')[2])
        .then((res) => setSpotifyTrack(res));
    }
  }, [song]);

  return (
    <Box>
      {room.name ? (
        spotifyTrack ? (
          <DashboardSongDisplay
            title={spotifyTrack.name}
            artist={spotifyTrack.artists[0].name}
            album={spotifyTrack.album.name}
            src={spotifyTrack.album.images[0].url}
          />
        ) : (
          <Button
            leftIcon={<FaPlus />}
            variant='ghost'
            onClick={() => setModal(Modal.QueueSong)}
          >
            <Text ml={1}>Pick a song to play!</Text>
          </Button>
        )
      ) : (
        <Text ml={[0, 2, 4, 8]} fontWeight={500} fontSize={18}>
          Join a room to start listening to music!
        </Text>
      )}
    </Box>
  );
};

export default PlaybackHeaderSongDisplay;

/*
roomInformation ? (
        roomInformation.currentSong ? (
          <DashboardSongDisplay
            title={roomInformation.currentSong.name}
            artist={roomInformation.currentSong.artists[0]}
            album={roomInformation.currentSong.album.name}
            src={roomInformation.currentSong.album.image.src}
          />
        ) : (
          <Button
            leftIcon='add'
            variant='ghost'
            onClick={() => setDisplayedModal('queue-song')}
          >
            <Text ml={1}>Pick a song to play!</Text>
          </Button>
        )
      )
*/
