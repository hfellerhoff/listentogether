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
  const [previousSongID, setPreviousSongID] = useState(0);

  useEffect(() => {
    if (song && song.spotifyUri) {
      if (previousSongID === song.id) {
      } else {
        setSpotifyTrack(undefined);
        setPreviousSongID(song.id);
        spotifyApi.setAccessToken(accessToken);
        spotifyApi
          .getTrack(song.spotifyUri.split(':')[2])
          .then((res) => setSpotifyTrack(res));
      }
    }
  }, [song]);

  return spotifyTrack;
};

export default useSpotifyTrack;
