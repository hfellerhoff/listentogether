import Song from 'models/Song';

export const calculateProgress = (song: Song) => {
  if (!song) return 0;

  const x = new Date();
  const updatedAtMS = song ? Date.parse(song.updatedAt) : 0;

  // Get current time
  let now = x.valueOf(); // - x.getTimezoneOffset() * 60 * 1000;
  if (now - updatedAtMS > 10000000) now -= x.getTimezoneOffset() * 60 * 1000;
  if (now - updatedAtMS < -10000000) now += x.getTimezoneOffset() * 60 * 1000;

  const progress = now - updatedAtMS + song.progress;

  if (song.isPaused) return song.progress;
  return progress;
};
