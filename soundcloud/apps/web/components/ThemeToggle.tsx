"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-orange-500" /> // Mặt trời màu cam khi dark mode
      ) : (
        <Moon className="h-5 w-5 text-gray-600" /> // Mặt trăng màu xám khi light mode
      )}
    </button>
  );
}