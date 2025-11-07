import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />;
      case 'light':
        return <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />;
      default:
        return <Monitor className="h-5 w-5 rotate-0 scale-100 transition-all" />;
    }
  };

  const themes = [
    {
      name: 'Light',
      value: 'light',
      icon: <Sun className="h-4 w-4" />,
      label: '☀️ Light Mode'
    },
    {
      name: 'Dark', 
      value: 'dark',
      icon: <Moon className="h-4 w-4" />,
      label: '🌙 Dark Mode'
    },
    {
      name: 'System',
      value: 'system',
      icon: <Monitor className="h-4 w-4" />,
      label: '🖥️ System'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === themeOption.value ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            {themeOption.icon}
            <span>{themeOption.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DarkModeToggle;
