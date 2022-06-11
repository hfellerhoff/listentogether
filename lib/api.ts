import Service from '../models/Service';
import Spotify from 'spotify-web-api-js';

export type SpotifyAPI = Spotify.SpotifyWebApiJs;

export class API {
  isInitialized = false;
  service: Service;
  api: SpotifyAPI;

  constructor() {}

  initialize(service: Service) {
    this.service = service;

    if (service === Service.Spotify) this.api = new Spotify();

    this.isInitialized = true;
  }
  q;

  setAccessToken() {
    if (this.service === Service.Spotify) {
    }
  }

  call() {
    if (!this.isInitialized) return;
  }
}
