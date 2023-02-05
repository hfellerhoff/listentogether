import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { useTheme } from 'next-themes';

interface Props {
  absolute?: boolean;
}

const ColorModeButton = ({ absolute }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { setTheme } = useTheme();

  const handleColorMode = () => {
    toggleColorMode();

    const updatedTheme = colorMode === 'light' ? 'dark' : 'light';
    setTheme(updatedTheme);
  };

  return (
    <IconButton
      variant='ghost'
      position={absolute ? 'absolute' : 'static'}
      top={4}
      right={4}
      onClick={handleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      aria-label='Toggle color mode'
    />
  );
};

export default ColorModeButton;
