import { useColorMode } from '@chakra-ui/react';

export const getBackgroundColor = (
  colorMode: 'light' | 'dark',
  type: 'foreground' | 'background'
) => {
  const foregroundColor = { light: 'white', dark: 'gray.800' };
  const backgroundColor = { light: 'gray.100', dark: 'gray.900' };

  switch (type) {
    case 'foreground':
      return foregroundColor[colorMode];
    case 'background':
      return backgroundColor[colorMode];
  }
};

const useBackgroundColor = () => {
  const { colorMode } = useColorMode();

  return {
    foregroundColor: getBackgroundColor(colorMode, 'foreground'),
    backgroundColor: getBackgroundColor(colorMode, 'background'),
  };
};

export default useBackgroundColor;
