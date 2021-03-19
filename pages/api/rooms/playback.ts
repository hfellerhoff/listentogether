import { customAlphabet } from 'nanoid';
import Song from '../../../models/Song';
import supabase from '../../../util/supabase/index';

export interface RoomPlaybackQuery {
  songId?: number;
  isPaused?: boolean;
}

export default async function handler(req, res) {
  const { songId, isPaused }: RoomPlaybackQuery = JSON.parse(req.body);

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId);

  const song: Song = songs[0];

  const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;
  const x = new Date();
  const now = x.getTime() + x.getTimezoneOffset() * 60 * 1000;
  const progress = now - updatedAtMS + song.progress;

  // console.log(new Date(now).toISOString());

  // Update song playback
  try {
    if (songId && isPaused !== undefined) {
      if (isPaused) {
        await supabase
          .from('songs')
          .update({
            isPaused,
            progress,
            updatedAt: 'now()',
          })
          .eq('id', songId);
      } else {
        await supabase
          .from('songs')
          .update({ isPaused, updatedAt: 'now()' })
          .eq('id', songId);
      }
    }
  } catch (err) {
    console.log(err);
  }

  res.end();
}
