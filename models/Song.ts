interface Song {
  id: number;
  spotifyUri: string;
  progress: number; // in milliseconds
  updatedAt: string; // timestamp
  addedAt: string; // timestamp
  isPaused: boolean;
  room_id: number;
}

export default Song;
