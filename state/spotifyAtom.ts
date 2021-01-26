import { atom } from 'jotai';
import Spotify from 'spotify-web-api-js';

export type SpotifyAPI = Spotify.SpotifyWebApiJs;

export const spotifyAtom = atom<SpotifyAPI>(new Spotify());
