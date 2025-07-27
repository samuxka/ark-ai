'use client'

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = theme === 'light';

  return (
    <Button
      size="icon"
      variant="outline"
      className="cursor-pointer w-full flex items-center justify-center"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >

      {isLight ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
      {isLight ? 'Light' : 'Dark'}
    </Button>
  );
}
