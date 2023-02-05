import {
  // Brand Scales
  tomato,
  green,
  tomatoDark,
  greenDark,

  // Gray Scales
  sage,
  sageDark,
} from '@radix-ui/colors';
import { createStitches, globalCss } from '@stitches/react';

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'system-ui',
  },
  'html, body': {
    background: '$neutral2',
  },
});

const copyColors = (color: Record<string, string>, name: string) =>
  Object.entries(color).reduce((copiedColors, [_, hsl], i) => {
    copiedColors[`${name}${i}`] = hsl;
    return copiedColors;
  }, {} as Record<string, string>);

export const primary = copyColors(green, 'primary');
export const error = copyColors(tomato, 'error');
export const neutral = copyColors(sage, 'neutral');

export const {
  theme: lightTheme,
  styled,
  createTheme,
  getCssText,
} = createStitches({
  theme: {
    colors: {
      // COLORS
      ...primary,
      ...error,

      // GRAYSCALE
      ...neutral,
    },
  },
});

export const darkTheme = createTheme({
  colors: {
    // COLORS
    ...copyColors(greenDark, 'primary'),
    ...copyColors(tomatoDark, 'error'),

    // GRAYSCALE
    ...copyColors(sageDark, 'neutral'),
  },
});
