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
});
export type AppRouter = typeof appRouter;

export default appRouter;
