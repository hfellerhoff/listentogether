import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { darkTheme, lightTheme } from '../stitches.config';

type Props = {
  children: React.ReactNode;
};

const StitchesThemeController = ({ children }: Props) => {
  const { theme, setTheme } = useTheme();
  const [activeClassName, setActiveClassName] = useState<string>();

  useEffect(() => {
    const newClass = theme === 'dark' ? darkTheme : lightTheme;

    setActiveClassName(newClass);
  }, [theme]);

  if (!activeClassName) return <></>;
  return <div className={activeClassName}>{children}</div>;
};

export default StitchesThemeController;
