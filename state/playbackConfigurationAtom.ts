import { atom } from 'jotai';

export interface PlaybackConfiguration {
  linked: boolean;
}

export const playbackConfigurationAtom = atom<PlaybackConfiguration>({
  linked: true,
});
