import SpotifyAPI from '.';
import { PlaybackAPIPlayProps } from '../playback/play';

export const play = async (props: PlaybackAPIPlayProps) => {
  const { spotify, song, progress } = props;

  if (!song?.spotifyUri) return;

  const device_id = await SpotifyAPI.getTargetDevice(props);
  if (!device_id) return;

  await spotify.play({
    uris: [song.spotifyUri],
    position_ms: progress,
    device_id,
  });
};
