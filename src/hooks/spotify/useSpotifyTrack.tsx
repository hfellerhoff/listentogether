import { useEffect, useState } from 'react';

import { useAuthContext } from 'src/lib/AuthProvider';
import useStore from 'src/state/store';

import Song from '../../models/Song';

const useSpotifyTrack = (song?: Song) => {
  const { spotify } = useStore((store) => ({
    spotify: store.spotify,
  }));

  const { session } = useAuthContext();
  const [spotifyTrack, setSpotifyTrack] =
    useState<SpotifyApi.SingleTrackResponse>();
  const [previousSongID, setPreviousSongID] = useState(0);

  useEffect(() => {
    if (song && song.spotifyUri && session?.provider_token) {
      if (previousSongID !== song.id) {
        setSpotifyTrack(undefined);
        setPreviousSongID(song.id);
        spotify.setAccessToken(session.provider_token);
        spotify
          .getTrack(song.spotifyUri.split(':')[2])
          .then((res) => setSpotifyTrack(res));
      }
    }
  }, [session?.provider_token, previousSongID, song, spotify]);

  return spotifyTrack;
};

export default useSpotifyTrack;
