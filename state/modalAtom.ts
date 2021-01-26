import { atom } from 'jotai';

export enum Modal {
  None = 'none',
  DeviceSelect = 'device-select',
  PlaybackControl = 'playback-control',
  QueueSong = 'queue-song',
}

export const modalAtom = atom<Modal>(Modal.None);
