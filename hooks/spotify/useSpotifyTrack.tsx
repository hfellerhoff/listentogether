import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import Song from '../../models/Song';
import { spotifyAtom } from '../../state/spotifyAtom';
import useSpotifyAuthentication from './useSpotifyAuthentication';

const useSpotifyTrack = (song: Song) => {
  const [spotifyApi] = useAtom(spotifyAtom);
  const { accessToken } = useSpotifyAuthentication();
  const [
    spotifyTrack,
    setSpotifyTrack,
  ] = useState<SpotifyApi.SingleTrackResponse>();

  useEffect(() => {
    if (song && song.spotifyUri) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getTrack(song.spotifyUri.split(':')[2])
        .then((res) => setSpotifyTrack(res));
    }
  }, [song]);

  return spotifyTrack;
};

export default useSpotifyTrack;
