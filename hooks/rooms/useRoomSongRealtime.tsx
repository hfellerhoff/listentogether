import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Song from '../../models/Song';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

const useRoomSongRealtime = () => {
  const [room] = useAtom(roomAtom);
  const [roomId, setRoomId] = useState<number>();
  const [songId, setSongId] = useState<number>();
  const [song, setSong] = useState<Song>();

  useEffect(() => {
    const fetchRoomSong = async () => {
      const roomSong = await supabase
        .from('room_song')
        .select('*')
        .eq('room_id', room.id);

      if (roomSong.body.length > 0) {
        setRoomId(roomSong.body[0].room_id);
        setSongId(roomSong.body[0].song_id);
      }
    };

    fetchRoomSong();
  }, [room]);

  useEffect(() => {
    const fetchSong = async () => {
      const songRes = await supabase.from('songs').select('*').eq('id', songId);

      if (songRes && songRes.body.length > 0) {
        setSong(songRes.body[0]);
      }
    };

    if (songId) fetchSong();
  }, [songId]);

  useEffect(() => {
    const roomSongSubscription = supabase
      .from('room_song')
      .on('INSERT', (payload) => {
        if (payload.new) {
          setRoomId(payload.new.room_id);
          setSongId(payload.new.song_id);
        }
      })
      .subscribe();

    const songSubscription = supabase
      .from('songs')
      .on('*', (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            return;
          case 'UPDATE':
            if (payload.new.id === songId) {
              console.log(payload);

              setSong(payload.new);
            }
            return;
          case 'DELETE':
            return;
        }
      })
      .subscribe();

    return () => {
      roomSongSubscription.unsubscribe();
      songSubscription.unsubscribe();
    };
  }, [songId]);

  return song;
};

export default useRoomSongRealtime;
