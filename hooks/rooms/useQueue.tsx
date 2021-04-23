import { useEffect, useState } from 'react';
import Room from '../../models/Room';
import Song from '../../models/Song';
import supabase from '../../util/supabase';
import useSupabaseSubscription from '../supabase/useSupabaseSubscription';

const useQueue = (room: Room) => {
  const roomSongs = useSupabaseSubscription('room_song', 'song_id', {
    column: 'room_id',
    value: room.id,
  });

  const [songs, setSongs] = useState<Song[]>([]);

  // When roomSongIds is updated, updated the list of queued songs in the room
  useEffect(() => {
    const songIds = roomSongs.array.map((roomSong) => roomSong.song_id);

    const fetchSong = async () => {
      const songsRes = await supabase
        .from('songs')
        .select('*')
        .in('id', songIds);

      if (songsRes && songsRes.body) {
        setSongs(songsRes.body);
      }
    };

    if (songIds.length > 0) fetchSong();
  }, [roomSongs]);

  // Subscribe to room_songs
  // When a new song is added, update the list of song ids.
  // useEffect(() => {
  //   const roomSongSubscription = supabase
  //     .from('room_song')
  //     .on('*', (payload) => {
  //       console.log('=== ROOM SONG CHANGE ===');
  //       console.log(payload);

  //       switch (payload.eventType) {
  //         case 'INSERT':
  //           if (payload.new) {
  //             console.log('Song id added:');
  //             console.log(payload.new);

  //             setSongIds([...songIds, payload.new.song_id]);
  //           }
  //           return;
  //         case 'UPDATE':
  //           return;
  //         case 'DELETE':
  //           setSongIds([...songIds.filter((id) => id !== payload.old.song_id)]);
  //           return;
  //       }
  //     })
  //     .subscribe();

  //   return () => {
  //     supabase.removeSubscription(roomSongSubscription);
  //   };
  // }, [songIds]);

  const songIds = roomSongs.array.map((roomSong) => roomSong.song_id);

  // Subscribe to songs
  // When a song is updated, update the list of songs.
  useEffect(() => {
    const songSubscription = supabase
      .from('songs')
      .on('*', (payload) => {
        console.log('=== SONGS CHANGE ===');
        console.log(payload);
        switch (payload.eventType) {
          case 'INSERT':
            return;
          case 'UPDATE':
            console.log('Song update:');
            console.log(payload.new.id, songIds);

            if (songIds.includes(payload.new.id)) {
              const removedOldSongs = songs.filter(
                (s) => s.id !== payload.new.id
              );
              setSongs([...removedOldSongs, payload.new as Song]);
            }
            return;
          case 'DELETE':
            return;
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(songSubscription);
    };
  }, [songIds, songs]);

  useEffect(() => {
    console.log('songs ids:', songIds);
  }, [songIds]);

  useEffect(() => {
    console.log('songs:', songs.length);
  }, [songs]);

  return songs.sort((a, b) => {
    if (a.addedAt <= b.addedAt) return -1;
    else return 1;
  });
};

export default useQueue;
