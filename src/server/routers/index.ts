import { customAlphabet } from 'nanoid';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';
import supabase from '@/util/supabase';
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
    .mutation(async (req) => {
      const room = {
        // ...req.input,
        name: req.input.name,
        isPublic: req.input.isPublic,
        slug: nanoid(),
      };

      const res = await supabase.from('rooms').insert([room]);

      if (!res.error) return room;
      return null;
    }),
});
export type AppRouter = typeof appRouter;

export default appRouter;
