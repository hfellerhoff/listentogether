import { trpcProxyClient } from 'src/server/client';

import { PlaybackProps } from '.';

export const skip = async ({ song }: PlaybackProps): Promise<void> => {
  if (!song) return;

  await trpcProxyClient.updatePlayback.mutate({
    shouldSkip: true,
    isSkipAtEnd: true,
    songId: song.id,
    track: {
      spotify_uri: song.spotifyUri,
      youtube_video_id: song.youtube_video_id,
      duration_ms: song.duration_ms,
    },
  });

  return;
};
