import { customAlphabet } from 'nanoid';
import supabase from '../../../util/supabase/index';

export interface RoomPlaybackQuery {
  songId?: number;
  isPaused?: boolean;
  progress?: number;
}

export default async function handler(req, res) {
  const { songId, isPaused, progress }: RoomPlaybackQuery = JSON.parse(
    req.body
  );

  console.log(req.body);

  const x = new Date();
  const now = x.getTime() + x.getTimezoneOffset() * 60 * 1000;

  // Update song playback
  if (songId && isPaused !== undefined) {
    if (isPaused) {
      await supabase
        .from('songs')
        .update({ isPaused, progress, updatedAt: 'now()' })
        .eq('id', songId);
    } else {
      await supabase
        .from('songs')
        .update({ isPaused, updatedAt: 'now()' })
        .eq('id', songId);
    }
  }

  res.end();
}
