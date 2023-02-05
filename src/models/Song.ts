interface Song {
  id: number;
  progress: number; // in milliseconds
  updatedAt: string; // timestamp
  addedAt: string; // timestamp
  isPaused: boolean;
  room_id: number;
  duration_ms: number;
  spotifyUri?: string;
  youtube_video_id?: string;
}

export default Song;
