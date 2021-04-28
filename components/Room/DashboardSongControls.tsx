import React from 'react';
import { Flex } from '@chakra-ui/react';
import ProgressSlider from './ProgressSlider';
import Song from '../../models/Song';
import SongControl from '../SongControl';
import useSpotifyTrack from '../../hooks/spotify/useSpotifyTrack';
import useSongProgress from '../../hooks/rooms/useSongProgress';

interface Props {
  song?: Song;
}

const DashboardSongControls = ({ song }: Props) => {
  const track = useSpotifyTrack(song);
  const progress = useSongProgress(song);

  return (
    <Flex direction='column' align='center' justify='center'>
      <SongControl song={song} progress={progress} />
      <ProgressSlider
        playback={{
          progress,
          length: track ? track.duration_ms : 1,
        }}
      />
    </Flex>
  );
};

export default DashboardSongControls;
