import { customAlphabet } from 'nanoid';
import Song from '../../../models/Song';
import supabase from '../../../util/supabase/index';

export interface RoomPlaybackQuery {
  songId?: number;
  isPaused?: boolean;
  shouldSkip?: boolean;
}

export default async function handler(req, res) {
  const { songId, isPaused, shouldSkip }: RoomPlaybackQuery = JSON.parse(
    req.body
  );

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId);

  const song: Song = songs[0];

  // SONG SKIPPING
  if (shouldSkip) {
    const {error} = await supabase.from('songs').delete().eq('id', songId);
    if (error) return;
    
    const otherSongs = await supabase
      .from('songs')
      .select('*')
      .range(0, 1);

    if (otherSongs.body.length > 0) {
      const nextSong = otherSongs.body[0] as Song;

      const res = await supabase
        .from('songs')
        .update({
          updatedAt: 'now()',
        })
        .eq('id', nextSong.id);

      console.log(res);
    }

    res.end();
    return;
  }

  // PLAYBACK TOGGLING (PAUSE / PLAY)
  if (song.progress === undefined) {
    res.end();
    return;
  }

  const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;
  const x = new Date();
  let now = x.valueOf();

  // Incredibly patchwork fix to an incredibly annoying problem
  if (now - updatedAtMS > 10000000) now -= x.getTimezoneOffset() * 60 * 1000;
  if (now - updatedAtMS < -10000000) now += x.getTimezoneOffset() * 60 * 1000;

  const progress = now - updatedAtMS + song.progress;

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
