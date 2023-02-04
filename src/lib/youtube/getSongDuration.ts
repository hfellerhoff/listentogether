import { PlaybackAPIPlayProps } from '../playback/play';

export const getSongDuration = async ({
  youtube,
  song,
}: PlaybackAPIPlayProps) => {
  if (!song.youtube_video_id || !youtube) return 0;

  return (await youtube.getDuration()) * 1000;
};
