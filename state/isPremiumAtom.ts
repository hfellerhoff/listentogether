import { atom } from 'jotai';

type PremiumStatusAtom = boolean;

export const isPremiumAtom = atom<PremiumStatusAtom>(true);
