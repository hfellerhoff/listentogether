import { PlaybackResponse } from '..';

export const handleAndReturn = async (
  promises: PlaybackResponse<Promise<unknown>>
): Promise<PlaybackResponse<unknown>> => {
  const [spotify, youtube] = await Promise.all([
    promises.spotify,
    promises.youtube,
  ]);

  return {
    spotify,
    youtube,
  };
};
