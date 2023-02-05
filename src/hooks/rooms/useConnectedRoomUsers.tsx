import { useEffect, useState } from 'react';

import { useAuthContext } from '@/lib/AuthProvider';
import { useProfileContext } from '@/lib/UserProvider';
import supabase from '@/util/supabase';

export interface ConnectedRoomUser {
  connection_id: string; // supabase auto-assigned connection id
  user_id: string; // supabase auth user id
  name: string;
  profile_photo: string;
  online_at: string;
  presence_ref: string;
}

export default function useConnectedRoomUsers(
  roomSlug?: string
): ConnectedRoomUser[] {
  const [presenceState, setPresenceState] = useState<ConnectedRoomUser[]>([]);
  const { session } = useAuthContext();
  const { user } = useProfileContext();

  useEffect(() => {
    if (!roomSlug) return;

    const channel = supabase.channel(`room:${roomSlug}`);

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();

      const transformedState = Object.entries(state).reduce(
        (partialState, [key, value]) => {
          if (value.length) {
            const presenceData = value[0] as Omit<
              ConnectedRoomUser,
              'connection_id'
            >;
            partialState.push({
              ...presenceData,
              connection_id: key,
            });
          }
          return partialState;
        },
        [] as ConnectedRoomUser[]
      );

      setPresenceState([...transformedState]);
    });

    // channel.on('presence', { event: 'join' }, (params) => {});

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && session) {
        await channel.track({
          user: session.user.id,
          name: user?.name || 'Anonymous Listener',
          profile_photo: user?.avatarUrl || '',
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomSlug, session, user?.name, user?.avatarUrl]);

  return presenceState;
}
