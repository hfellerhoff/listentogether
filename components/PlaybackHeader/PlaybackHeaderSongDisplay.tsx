import { Box, Button, Text } from '@chakra-ui/react';
import DashboardSongDisplay from '../Room/DashboardSongDisplay';
import Song from '../../models/Song';
import { FaPlus } from 'react-icons/fa';
import Room from '../../models/Room';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import useStore, { Modal } from 'state/store';

interface Props {
  song?: Song;
  room: Room;
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
