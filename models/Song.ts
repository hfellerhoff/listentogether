interface Song {
  id: number;
  spotifyUri: string;
  progress: number; // in milliseconds
  updatedAt: string; // in milliseconds
  isPaused: boolean;
}

export default Song;
