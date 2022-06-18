import { RoomPlaybackQuery } from 'pages/api/rooms/playback';
import { PlaybackProps } from '.';

export const skip = async ({ song }: PlaybackProps): Promise<void> => {
  // handle skip
  await fetch('/api/rooms/playback', {
    method: 'POST',
    body: JSON.stringify({
      shouldSkip: true,
      isSkipAtEnd: true,
      songId: song.id,
      track: {
        spotify_uri: song.spotifyUri,
        youtube_video_id: song.youtube_video_id,
        duration_ms: song.duration_ms,
      },
    } as RoomPlaybackQuery),
  });

  return;
};
