import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Song from '../../models/Song';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

const useRoomSongs = () => {
  const [room] = useAtom(roomAtom);

  const [songIds, setSongIds] = useState<number[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  // Initially fetch the room songs
  useEffect(() => {
    const fetchRoomSongs = async () => {
      const roomSongs = await supabase
        .from('room_song')
        .select('*')
        .eq('room_id', room.id);

      if (roomSongs.body.length > 0) {
        setSongIds(roomSongs.body.map((s) => s.song_id as number));
      }
    };

    fetchRoomSongs();
  }, [room]);

  // When roomSongIds is updated, updated the list of queued songs in the room
  useEffect(() => {
    const fetchSong = async () => {
      const songsRes = await supabase
        .from('songs')
        .select('*')
        .in('id', songIds);

      if (songsRes && songsRes.body.length > 0) {
        setSongs(songsRes.body);
      }
    };

    if (songIds.length > 0) fetchSong();
  }, [songIds]);

  // Subscribe to room_songs
  // When a new song is added, update the list of song ids.
  useEffect(() => {
    const roomSongSubscription = supabase
      .from('room_song')
      .on('*', (payload) => {
        console.log('=== ROOM SONG CHANGE ===');
        console.log(payload);

        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new) {
              console.log('Song id added:');
              console.log(payload.new);

              setSongIds([...songIds, payload.new.song_id]);
            }
            return;
          case 'UPDATE':
            return;
          case 'DELETE':
            setSongIds([...songIds.filter((id) => id !== payload.old.song_id)]);
            return;
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(roomSongSubscription);
    };
  }, [songIds]);

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

export default useRoomSongs;
