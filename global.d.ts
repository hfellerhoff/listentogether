declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    spotifyWebPlayer?: Spotify.Player;
  }
}

export {};
