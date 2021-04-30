import Song from '../../../models/Song';
import supabase from '../../../util/supabase';

interface QueueProps {
  spotifyUri?: string;
  roomId?: number;
}

export default async function handler(req, res) {
  const props: QueueProps = JSON.parse(req.body);

  if (props && props.spotifyUri && props.roomId) {
    // Queue a song
    const song = {
      spotifyUri: props.spotifyUri,
      progress: 0,
      isPaused: false,
      room_id: props.roomId,
    };

    const songResponse = await supabase.from('songs').insert([song]);
    if (songResponse.body && songResponse.body[0]) {
      const supabaseSong: Song = songResponse.body[0];

      res.json({
        room_id: props.roomId,
        song_id: supabaseSong.id,
      });
    }
  }

  res.end();
}
