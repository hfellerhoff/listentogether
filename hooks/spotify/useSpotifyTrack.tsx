import { useEffect, useState } from 'react';
import useStore from 'state/store';
import Song from '../../models/Song';
import useSpotifyAuthentication from './useSpotifyAuthentication';

const useSpotifyTrack = (song: Song) => {
  const { spotify } = useStore((store) => ({
    spotify: store.spotify,
  }));

  const { accessToken } = useSpotifyAuthentication();
  const [spotifyTrack, setSpotifyTrack] =
    useState<SpotifyApi.SingleTrackResponse>();
  const [previousSongID, setPreviousSongID] = useState(0);

  useEffect(() => {
    if (song && song.spotifyUri) {
      if (previousSongID === song.id) {
      } else {
        setSpotifyTrack(undefined);
        setPreviousSongID(song.id);
        spotify.setAccessToken(accessToken);
        spotify
          .getTrack(song.spotifyUri.split(':')[2])
          .then((res) => setSpotifyTrack(res));
      }
    }
  }, [song]);

  return spotifyTrack;
};

export default useSpotifyTrack;
