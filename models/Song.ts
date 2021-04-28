interface Song {
  id: number;
  spotifyUri: string;
  progress: number; // in milliseconds
  updatedAt: string; // timestamp
  addedAt: string; // timestamp
  isPaused: boolean;
}

export default Song;
