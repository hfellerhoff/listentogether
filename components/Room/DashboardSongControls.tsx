import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProgressSlider from './ProgressSlider';
import Song from '../../models/Song';
import SongControl from '../SongControl';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from '../../hooks/useSpotifyAuthentication';

interface Props {}

const DashboardSongControls = (props: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();
  const [progress, setProgress] = useState(0);
  const [
    spotifyTrack,
    setSpotifyTrack,
  ] = useState<SpotifyApi.SingleTrackResponse>();

  const song: Song = {
    spotifyUri: 'spotify:track:2RlgNHKcydI9sayD2Df2xp',
    progress: 0, // in milliseconds
    updatedAt: 1614966134327, // in milliseconds
    isPaused: false,
  };

  useEffect(() => {
    if (song.spotifyUri) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getTrack(song.spotifyUri.split(':')[2])
        .then((res) => setSpotifyTrack(res));
    }
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      setProgress(
        song.updatedAt ? Date.now() - song.updatedAt + song.progress : 0
      );
      console.log(
        song.updatedAt ? Date.now() - song.updatedAt + song.progress : 0
      );
    };

    if (!song.updatedAt) return;
    const interval = setInterval(calculateProgress, 250);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [song]);

  return (
    <Flex direction='column' align='center' justify='center'>
      <SongControl song={song} />
      <ProgressSlider
        playback={{
          progress,
          length: spotifyTrack ? spotifyTrack.duration_ms : 1,
        }}
      />
    </Flex>
  );
};

export default DashboardSongControls;
