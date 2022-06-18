import { PlaybackResponse } from '..';

export const handleAndReturn = async (
  promises: PlaybackResponse<Promise<any>>
): Promise<PlaybackResponse<any>> => {
  const [spotify, youtube] = await Promise.all([
    promises.spotify,
    promises.youtube,
  ]);

  return {
    spotify,
    youtube,
  };
};
