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
  const [currentSongId, setCurrentSongId] = useState(-1);
  const [progress, setProgress] = useState(-1);
  const [
    spotifyTrack,
    setSpotifyTrack,
  ] = useState<SpotifyApi.SingleTrackResponse>();

  const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;

  useEffect(() => {
    if (song) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getTrack(song.spotifyUri.split(':')[2]).then((res) => {
        setSpotifyTrack(res);
      });
    }
  }, [song]);

  useEffect(() => {
    const calculateProgress = () => {
      const x = new Date();
      const now = x.getTime() + x.getTimezoneOffset() * 60 * 1000;

      if (song.isPaused) setProgress(song.progress);
      else setProgress(song ? now - updatedAtMS + song.progress : 0);
    };

    if (!song) return;
    const interval = setInterval(calculateProgress, 250);

    if (currentSongId !== song.id) setCurrentSongId(song.id);
    else setProgress(-1);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [song]);

  return (
    <Flex direction='column' align='center' justify='center'>
      <SongControl song={song} progress={progress} />
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
