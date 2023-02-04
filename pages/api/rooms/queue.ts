import { NextApiHandler } from 'next';

import Song from '../../../src/models/Song';
import supabase from '../../../src/util/supabase';

export interface QueueProps {
  spotifyUri?: string;
  youtubeVideoID?: string;
  roomId?: number;
  progress?: number;
  duration_ms: number;
}

const handler: NextApiHandler = async (req, res) => {
  const props: QueueProps = JSON.parse(req.body);

  const { roomId, spotifyUri, youtubeVideoID, progress, duration_ms } = props;

  if (props && roomId && (spotifyUri || youtubeVideoID) && duration_ms) {
    const roomSongResponse = await supabase
      .from('songs')
      .select('id')
      .eq('room_id', roomId);
    const hasCurrentSong = !!roomSongResponse.data?.length;

    const song: Partial<Song> = {
      spotifyUri: spotifyUri || undefined,
      youtube_video_id: youtubeVideoID || undefined,
      progress: progress || 0,
      isPaused: hasCurrentSong,
      room_id: roomId,
      duration_ms: duration_ms,
    };

    const songResponse = await supabase.from('songs').insert([song]);
    if (songResponse.data?.length) {
      const supabaseSong = songResponse.data[0] as unknown as Song;

      res.json({
        room_id: roomId,
        song_id: supabaseSong.id,
      });
    }
  }

  res.end();
};
export default handler;
