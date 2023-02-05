import { PlaybackAPIPlayProps } from '../playback/play';

export const getTargetDevice = async ({
  spotify,
}: PlaybackAPIPlayProps): Promise<string | null> => {
  const devices = await spotify.getMyDevices();

  const activeDevices = devices.devices.filter((d) => d.is_active);
  if (devices.devices.length > 0) {
    if (activeDevices.length === 0) {
      return devices.devices[0].id;
    } else {
      return activeDevices[0].id;
    }
  }
  return null;
};
