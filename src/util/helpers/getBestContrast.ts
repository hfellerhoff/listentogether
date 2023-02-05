export const getBestContrast = (rgbArray: number[]) => {
  // if (rgbArray.length !== 3) return '#000000';

  const r = rgbArray[0];
  const g = rgbArray[1];
  const b = rgbArray[2];
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  const whiteBrightness = (299 * 255 + 587 * 255 + 114 * 255) / 1000;
  const blackBrightness = 0;

  if (whiteBrightness - brightness > brightness - blackBrightness)
    return '#ffffff';
  return '#000000';
};
