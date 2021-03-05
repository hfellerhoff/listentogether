import Song from '../../../models/Song';
import supabase from '../../../util/supabase';

interface QueueProps {
  spotifyUri?: string;
  roomId?: number;
}

export default async function handler(req, res) {
  const props: QueueProps = JSON.parse(req.body);

  if (props && props.spotifyUri && props.roomId) {
    // Check if a song has been queued for this room
    const roomSongResponse = await supabase
      .from('room_song')
      .select('*')
      .eq('room_id', props.roomId);

    // If song has been queued, delete it
    if (roomSongResponse.body.length > 0) {
      await supabase.from('room_song').delete().eq('room_id', props.roomId);

      await supabase
        .from('songs')
        .delete()
        .eq('id', roomSongResponse.body[0].song_id);
    }

    // Queue a song
    const song = {
      spotifyUri: props.spotifyUri,
      progress: 0,
      isPaused: false,
    };

    const songResponse = await supabase.from('songs').insert([song]);
    if (songResponse.body && songResponse.body[0]) {
      const supabaseSong: Song = songResponse.body[0];

      // Add song to room_songs database
      await supabase.from('room_song').insert([
        {
          room_id: props.roomId,
          song_id: supabaseSong.id,
        },
      ]);

      res.json({
        room_id: props.roomId,
        song_id: supabaseSong.id,
      });
    }
  }

  res.end();
}
