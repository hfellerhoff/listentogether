// import Spotify from 'spotify-web-api-js';

import ListenTogetherAPI from './listen-together';
import SpotifyAPI from './spotify';

export type ServiceAPI = {
  Routes: Record<string, string>;
  Cookies: Record<string, string>;
  Secrets: Record<string, string>;
};

const API = {
  ListenTogether: ListenTogetherAPI,
  Spotify: SpotifyAPI,
};

export default API;
