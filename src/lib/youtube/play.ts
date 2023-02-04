import { PlaybackAPIPlayProps } from '../playback/play';

export const play = async ({
  youtube,
  song,
  progress,
}: PlaybackAPIPlayProps) => {
  if (!youtube || !song.youtube_video_id) return;

  return await youtube.loadVideoById({
    videoId: song.youtube_video_id,
    startSeconds: progress / 1000,
  });
};
