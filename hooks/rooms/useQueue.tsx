import Room from '../../models/Room';
import useRoomSongs from '../supabase/useRoomSongs';
import useSongs from '../supabase/useSongs';

const useQueue = (room: Room) => {
  const roomSongs = useRoomSongs(room.id);
  const songIDs = roomSongs.array.map((roomSong) => roomSong.song_id);
  const songs = useSongs(songIDs);

  const sortedSongs = songs.array.sort((a, b) => {
    if (a.addedAt <= b.addedAt) return -1;
    else return 1;
  });

  return sortedSongs;
};

export default useQueue;
