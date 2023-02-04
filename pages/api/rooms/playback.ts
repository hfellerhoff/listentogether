import { NextApiHandler } from 'next';

import Song from '../../../src/models/Song';
import supabase from '../../../src/util/supabase/index';

export interface RoomPlaybackQuery {
  songId?: number;
  track?: {
    spotify_uri?: string;
    youtube_video_id?: string;
    duration_ms: number;
  };
  isPaused?: boolean;
  shouldSkip?: boolean;
  isSkipAtEnd?: boolean;
}

const handler: NextApiHandler = async (req, res) => {
  const {
    songId,
    track,
    isPaused,
    shouldSkip,
    isSkipAtEnd,
  }: RoomPlaybackQuery = JSON.parse(req.body);

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId);

  if (!songs?.length) {
    res.end();
    return;
  }

  const song: Song = songs[0];

  if (!song || song.progress === undefined || song.progress === null) {
    res.end();
    return;
  }

  // CALCULATE PROGRESS
  const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;
  const x = new Date();
  let now = x.valueOf();

  // Incredibly patchwork fix to an incredibly annoying problem
  if (now - updatedAtMS > 10000000) now -= x.getTimezoneOffset() * 60 * 1000;
  if (now - updatedAtMS < -10000000) now += x.getTimezoneOffset() * 60 * 1000;

  const progress = now - updatedAtMS + song.progress;

  // SONG SKIPPING
  if (shouldSkip) {
    if (
      !track ||
      (song.spotifyUri !== track.spotify_uri &&
        song.youtube_video_id !== track.youtube_video_id)
    ) {
      res.end();
      return;
    }

    // If the client thinks the song is over but the server doesn't, don't skip
    if (isSkipAtEnd && track.duration_ms > progress) {
      res.end();
      return;
    }

    await supabase.from('room_song').delete().eq('song_id', songId);
    await supabase.from('songs').delete().eq('id', songId);

    const otherSongs = await supabase
      .from('songs')
      .select('*')
      .eq('room_id', song.room_id)
      .range(0, 1);

    if (otherSongs.data?.length) {
      const nextSong = otherSongs.data[0] as Song;

      const res = await supabase
        .from('songs')
        .update({
          updatedAt: 'now()',
          isPaused: false,
        })
        .eq('id', nextSong.id);

      console.log(res);
    }

    res.end();
    return;
  }

  // PLAYBACK TOGGLING (PAUSE / PLAY)

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
};
export default handler;
