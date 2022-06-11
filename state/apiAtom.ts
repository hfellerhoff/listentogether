import { atom } from 'jotai';
import { API } from '../lib/api';
import Service from '../models/Service';

export const apiAtom = atom<API>(new API(Service.Spotify));
