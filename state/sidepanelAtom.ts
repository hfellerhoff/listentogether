import { atom } from 'jotai';
import Room from '../models/Room';

type SidepanelAtom = {
  isLeftOpen: boolean;
  isRightOpen: boolean;
};

export const SIDEPANEL_EMPTY: SidepanelAtom = {
  isLeftOpen: true,
  isRightOpen: true,
};

export const sidepanelAtom = atom<SidepanelAtom>(SIDEPANEL_EMPTY);
