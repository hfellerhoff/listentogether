import { Box, Button, Text } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

import useStore, { Modal } from 'src/state/store';

import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import Room from '../../models/Room';
import Song from '../../models/Song';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';

interface Props {
  song?: Song;
  room?: Room;
}

const PlaybackHeaderSongDisplay = ({ song, room }: Props) => {
  const { handleSetModal } = useStore((store) => ({
    handleSetModal: store.handleSetModal,
  }));

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
            onClick={handleSetModal(Modal.QueueSong)}
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
