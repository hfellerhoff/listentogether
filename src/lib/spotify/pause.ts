import SpotifyAPI from '.';
import { PlaybackProps } from '../playback';

export const pause = async (props: PlaybackProps) => {
  const device_id = await SpotifyAPI.getTargetDevice(props);
  if (!device_id) return;

  try {
    return await props.spotify.pause();
  } catch {
    return null;
  }
};
