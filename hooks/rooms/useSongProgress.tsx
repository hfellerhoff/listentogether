import React, { useEffect, useState } from 'react';
import Song from '../../models/Song';

interface Props {}

const useSongProgress = (song: Song) => {
  const [progress, setProgress] = useState(-1);

  const updatedAtMS = song ? Date.parse(song.updatedAt) : 0;

  useEffect(() => {
    const calculateProgress = (s: Song) => {
      const x = new Date();

      // Get current time
      let now = x.valueOf(); // - x.getTimezoneOffset() * 60 * 1000;
      if (now - updatedAtMS > 10000000)
        now -= x.getTimezoneOffset() * 60 * 1000;
      if (now - updatedAtMS < -10000000)
        now += x.getTimezoneOffset() * 60 * 1000;

      const newProgress = now - updatedAtMS + s.progress;

      if (s.isPaused) setProgress(s.progress);
      else setProgress(newProgress);
    };

    if (!song) return;
    const interval = setInterval(() => calculateProgress(song), 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [song, progress]);

  return progress;
};

export default useSongProgress;
