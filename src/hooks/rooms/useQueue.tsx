import { Queue } from '../../models/Room';
import useSongs from '../supabase/useSongs';

const useQueue = (roomID: number): Queue => useSongs(roomID).array;

export default useQueue;
