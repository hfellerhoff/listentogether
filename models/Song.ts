interface Song {
  spotifyUri: string;
  progress: number; // in milliseconds
  updatedAt: number; // in milliseconds
  isPaused: boolean;
}

export default Song;
