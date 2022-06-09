import { createStitches, globalCss } from '@stitches/react';
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

export const {
  theme: lightTheme,
  styled,
  createTheme,
  getCssText,
} = createStitches({
  theme: {
    colors: {
      // COLORS
      ...copyColors(green, 'primary'),
      ...copyColors(tomato, 'error'),

      // GRAYSCALE
      ...copyColors(sage, 'neutral'),
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