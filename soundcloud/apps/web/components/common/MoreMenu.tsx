"use client";

import { usePlayerStore } from "@/store/playerStore";
import { ListMusic, ListPlus, LucideIcon, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface SimpleTrack {
  id: string;
  title: string;
  imagePath?: string | null;
  audioPath?: string | null;
  user?: {
    name?: string | null;
  } | null;

  [key: string]: any;
}

interface MoreMenuProps {
  track: SimpleTrack;
  trigger?: React.ReactNode;
  triggerClassName?: string;
}

export default function MoreMenu({
  track,
  trigger,
  triggerClassName,
}: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { addToQueue } = usePlayerStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNextUp = (e: React.MouseEvent) => {
    e.stopPropagation();

    addToQueue(track as any);
    setIsOpen(false);
    toast.success("Added to Next up");
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    toast.info("Open Playlist Modal...");
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 2. Logic Trigger linh hoạt: */}
      <div onClick={toggleMenu} className="cursor-pointer">
        {trigger ? (
          trigger
        ) : (
          <ActionButton
            icon={MoreHorizontal}
            label="More"
            active={isOpen}
            activeColor="border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-neutral-800"
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-md shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleNextUp}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ListPlus className="w-4 h-4" />
            Add to Next up
          </button>

          <button
            onClick={handleAddToPlaylist}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ListMusic className="w-4 h-4" />
            Add to Playlist
          </button>
        </div>
      )}
    </div>
  );
}

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  activeColor?: string;
}

export function ActionButton({
  icon: Icon,
  label,
  count,
  onClick,
  active,
  activeColor,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 border rounded-[3px] text-xs font-medium transition-colors bg-transparent",
        active
          ? cn(activeColor, "bg-gray-50 dark:bg-white/5")
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
      )}
    >
      <Icon className={cn("w-3.5 h-3.5", active && "fill-current")} />
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={cn(active ? "text-current" : "text-gray-400")}>
          {count}
        </span>
      )}
    </button>
  );
}
