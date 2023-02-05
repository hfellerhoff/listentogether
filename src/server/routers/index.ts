import { customAlphabet } from 'nanoid';
import { z } from 'zod';

import supabase from '@/util/supabase';
import Song from 'src/models/Song';

import { publicProcedure, router } from '../trpc';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

const appRouter = router({
  createRoom: publicProcedure
    .input(
      z.object({
        name: z.string(),
        isPublic: z.boolean().optional().default(true),
        owner_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const room = {
        name: input.name,
        isPublic: input.isPublic,
        slug: nanoid(),
      };

      const res = await supabase.from('rooms').insert([room]);

      if (!res.error) return room;
      return null;
    }),
  queueSong: publicProcedure
    .input(
      z.object({
        spotifyUri: z.string().optional(),
        youtubeVideoID: z.string().optional(),
        roomId: z.number().optional(),
        progress: z.number().optional(),
        duration_ms: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { roomId, spotifyUri, youtubeVideoID, progress, duration_ms } =
        input;

      if (roomId && (spotifyUri || youtubeVideoID) && duration_ms) {
        const roomSongResponse = await supabase
          .from('songs')
          .select('id')
          .eq('room_id', roomId);
        const hasCurrentSong = !!roomSongResponse.data?.length;

        const song: Partial<Song> = {
          spotifyUri: spotifyUri || undefined,
          youtube_video_id: youtubeVideoID || undefined,
          progress: progress || 0,
          isPaused: hasCurrentSong,
          room_id: roomId,
          duration_ms: duration_ms,
        };

        const songResponse = await supabase.from('songs').insert([song]);
        if (songResponse.data?.length) {
          const supabaseSong = songResponse.data[0] as unknown as Song;

          return {
            room_id: roomId,
            song_id: supabaseSong.id,
          };
        }
      }
    }),
  updatePlayback: publicProcedure
    .input(
      z.object({
        songId: z.number().optional(),
        track: z
          .object({
            spotify_uri: z.string().nullable().optional(),
            youtube_video_id: z.string().nullable().optional(),
            duration_ms: z.number(),
          })
          .optional(),
        isPaused: z.boolean().optional(),
        shouldSkip: z.boolean().optional(),
        isSkipAtEnd: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { songId, track, isPaused, shouldSkip, isSkipAtEnd } = input;

      const { data: songs } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId);

      if (!songs?.length) {
        return;
      }

      const song: Song = songs[0];

      if (!song || song.progress === undefined || song.progress === null) {
        return;
      }

      // CALCULATE PROGRESS
      const updatedAtMS = song ? Date.parse(song.updatedAt).valueOf() : 0;
      const x = new Date();
      let now = x.valueOf();

      // Incredibly patchwork fix to an incredibly annoying problem
      if (now - updatedAtMS > 10000000)
        now -= x.getTimezoneOffset() * 60 * 1000;
      if (now - updatedAtMS < -10000000)
        now += x.getTimezoneOffset() * 60 * 1000;

      const progress = now - updatedAtMS + song.progress;

      // SONG SKIPPING
      if (shouldSkip) {
        if (
          !track ||
          (song.spotifyUri !== track.spotify_uri &&
            song.youtube_video_id !== track.youtube_video_id)
        ) {
          return;
        }

        // If the client thinks the song is over but the server doesn't, don't skip
        if (isSkipAtEnd && track.duration_ms > progress) {
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
    }),
});
export type AppRouter = typeof appRouter;

export default appRouter;
