import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';

import Song from '../../models/Song';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

const useRoomSongRealtime = () => {
  const [room] = useAtom(roomAtom);
  // const [roomId, setRoomId] = useState<number>();
  const [songId, setSongId] = useState<number>();
  const [song, setSong] = useState<Song>();

  useEffect(() => {
    const fetchRoomSong = async () => {
      const roomSongs = await supabase
        .from('room_song')
        .select('*')
        .eq('room_id', room.id);

      if (roomSongs.data?.length) {
        // setRoomId(roomSongs.data[0].room_id);
        setSongId(roomSongs.data[0].song_id);
      }
    };

    fetchRoomSong();
  }, [room]);

  useEffect(() => {
    const fetchSong = async () => {
      const songRes = await supabase.from('songs').select('*').eq('id', songId);

      if (songRes && songRes.data?.length) {
        setSong(songRes.data[0]);
      }
    };

    if (songId) fetchSong();
  }, [songId]);

  useEffect(() => {
    const roomSongSubscription = supabase
      .channel('public:room_song')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_song',
        },
        (payload) => {
          if (payload.new) {
            // setRoomId(payload.new.room_id);
            setSongId(payload.new.song_id);
          }
        }
      )
      .subscribe();

    const songSubscription = supabase
      .channel('public:songs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              return;
            case 'UPDATE':
              if (payload.new.id === songId) {
                setSong(payload.new as Song);
              }
              return;
            case 'DELETE':
              return;
          }
        }
      )
      .subscribe();

    return () => {
      roomSongSubscription.unsubscribe();
      songSubscription.unsubscribe();
    };
  }, [songId]);

  return song;
};

export default useRoomSongRealtime;
