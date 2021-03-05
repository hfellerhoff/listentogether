import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProgressSlider from './ProgressSlider';
import Song from '../../models/Song';
import SongControl from '../SongControl';
import { useAtom } from 'jotai';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from '../../hooks/useSpotifyAuthentication';

interface Props {
  song?: Song;
}

const DashboardSongControls = ({ song }: Props) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();
  const [progress, setProgress] = useState(0);
  const [
    spotifyTrack,
    setSpotifyTrack,
  ] = useState<SpotifyApi.SingleTrackResponse>();

  const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;

  useEffect(() => {
    if (song) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getTrack(song.spotifyUri.split(':')[2])
        .then((res) => setSpotifyTrack(res));
    }
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      const x = new Date();
      const now = x.getTime() + x.getTimezoneOffset() * 60 * 1000;

      setProgress(song ? now - updatedAtMS + song.progress : 0);
    };

    if (!song) return;
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
