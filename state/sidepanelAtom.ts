import { atom } from 'jotai';

type SidepanelAtom = {
  isLeftOpen: boolean;
  isRightOpen: boolean;
};

export const SIDEPANEL_EMPTY: SidepanelAtom = {
  isLeftOpen: false,
  isRightOpen: false,
};

export const sidepanelAtom = atom<SidepanelAtom>(SIDEPANEL_EMPTY);
