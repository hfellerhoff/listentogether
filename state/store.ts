import create from 'zustand';
import produce from 'immer';
import YouTube from 'react-youtube';
import Spotify from 'spotify-web-api-js';

export enum Modal {
  None = 'none',
  DeviceSelect = 'device-select',
  PlaybackControl = 'playback-control',
  QueueSong = 'queue-song',
}

export type SpotifyAPI = Spotify.SpotifyWebApiJs;
export type YouTubeAPI = YouTube['internalPlayer'] | null;

export interface Store {
  set: (callback: (store: Store) => void) => void;

  modal: Modal;
  setModal: (modal: Modal) => void;
  handleSetModal: (modal: Modal) => () => void;

  spotify: SpotifyAPI;
  youtube: YouTubeAPI;
  setYouTube: (youtube: YouTubeAPI) => void;
}

const useStore = create<Store>((set, get) => ({
  set: (callback) => set(produce(callback)),

  modal: Modal.None,
  setModal: (modal) => set({ modal }),
  handleSetModal: (modal) => () => set({ modal }),

  spotify: new Spotify(),

  youtube: null,
  setYouTube: (youtube) => set({ youtube }),
}));

export default useStore;
