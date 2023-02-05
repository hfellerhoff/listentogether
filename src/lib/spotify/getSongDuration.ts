import { PlaybackAPIPlayProps } from '../playback/play';

export const getSongDuration = async ({
  spotify,
  song,
}: PlaybackAPIPlayProps) => {
  if (!song?.spotifyUri) return;

  const track = await spotify.getTrack(song.spotifyUri.split(':')[2]);

  return track.duration_ms;
};
