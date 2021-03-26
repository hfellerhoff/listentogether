import React, { useEffect, useState } from 'react';
import Song from '../../models/Song';

interface Props {}

const useSongProgress = (song: Song) => {
  const [progress, setProgress] = useState(0);

  const updatedAtMS = song ? Date.parse(song.updatedAt) : 0;

  useEffect(() => {
    const calculateProgress = () => {
      const x = new Date();
      const now = x.valueOf(); //+ x.getTimezoneOffset() * 60 * 1000; // - x.getTimezoneOffset() * 60 * 1000;
      const newProgress = now - updatedAtMS + song.progress;

      if (song.isPaused) setProgress(song.progress);
      else setProgress(newProgress);
    };

    if (!song) return;
    const interval = setInterval(calculateProgress, 250);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [song]);

  return progress;
};

export default useSongProgress;
