import { useEffect, useMemo, useState } from 'react';

import Song from '../../models/Song';

// The amount of time for realtime playback to lag behind the server queue time.
// Useful for not cutting off the beginnings of songs.
const PROGRESS_DELAY = 0;

const useSongProgress = (song?: Song) => {
  const [progress, setProgress] = useState(-1);

  const updatedAtMS = useMemo(() => {
    return song ? Date.parse(song.updatedAt) : 0;
  }, [song]);

  useEffect(() => {
    const calculateProgress = (s: Song) => {
      const x = new Date();

      // Get current time
      let now = x.valueOf() - PROGRESS_DELAY; // - x.getTimezoneOffset() * 60 * 1000;
      if (now - updatedAtMS > 10000000)
        now -= x.getTimezoneOffset() * 60 * 1000;
      if (now - updatedAtMS < -10000000)
        now += x.getTimezoneOffset() * 60 * 1000;

      const newProgress = now - updatedAtMS + s.progress;

      if (s.isPaused) setProgress(s.progress);
      else setProgress(newProgress);
    };

    if (!song) {
      setProgress(-1);
      return;
    }
    const interval = setInterval(() => calculateProgress(song), 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [song, progress, updatedAtMS]);

  return progress;
};

export default useSongProgress;
