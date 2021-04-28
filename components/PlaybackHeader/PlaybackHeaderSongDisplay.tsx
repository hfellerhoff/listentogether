import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import { useAtom } from 'jotai';
import { Modal, modalAtom } from '../../state/modalAtom';
import { roomAtom } from '../../state/roomAtom';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from '../../hooks/spotify/useSpotifyAuthentication';
import Song from '../../models/Song';
import { FaPlus } from 'react-icons/fa';
import Room from '../../models/Room';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';

interface Props {
  song?: Song;
  room: Room;
}

const PlaybackHeaderSongDisplay = ({ song, room }: Props) => {
  const [, setModal] = useAtom(modalAtom);
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();
  const track = useSpotifyTrack(song);

  return (
    <Box>
      {room && room.name ? (
        song && track ? (
          <DashboardSongDisplay
            title={track.name}
            artist={track.artists[0].name}
            album={track.album.name}
            src={track.album.images[0].url}
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
