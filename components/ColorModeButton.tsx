import React from 'react';
import { useColorMode, Button, Icon, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface Props {
  absolute?: boolean;
}

const ColorModeButton = ({ absolute }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant='ghost'
      position={absolute ? 'absolute' : 'static'}
      top={4}
      right={4}
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      aria-label='Toggle color mode'
    />
  );
};

export default ColorModeButton;
