import Song from '../../../models/Song';
import supabase from '../../../util/supabase';

export interface QueueProps {
  spotifyUri?: string;
  youtubeVideoID?: string;
  roomId?: number;
  progress?: number;
  duration_ms: number;
}

export default async function handler(req, res) {
  const props: QueueProps = JSON.parse(req.body);

  const { roomId, spotifyUri, youtubeVideoID, progress, duration_ms } = props;

  if (props && roomId && (spotifyUri || youtubeVideoID) && duration_ms) {
    // Queue a song
    const song: Partial<Song> = {
      spotifyUri: spotifyUri || null,
      youtube_video_id: youtubeVideoID || null,
      progress: progress || 0,
      isPaused: false,
      room_id: roomId,
      duration_ms: duration_ms,
    };

    const songResponse = await supabase.from('songs').insert([song]);
    if (songResponse.body && songResponse.body[0]) {
      const supabaseSong: Song = songResponse.body[0];

      res.json({
        room_id: roomId,
        song_id: supabaseSong.id,
      });
    }
  }

  res.end();
}
