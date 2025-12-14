"use client";

import { SlidersHorizontal, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui2/Button";

export type SortOption =
  | "newest"
  | "oldest"
  | "plays"
  | "name_asc"
  | "name_desc";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "plays", label: "Lượt nghe nhiều nhất" },
  { value: "name_asc", label: "Tên (A-Z)" },
  { value: "name_desc", label: "Tên (Z-A)" },
];

export default function SortDropdown({
  value,
  onChange,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <Button
        variant="outline"
        onClick={() => setOpen((p) => !p)}
        className="rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer"
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Sắp xếp
      </Button>

      {open && (
        <>
          {/* Overlay – không ảnh hưởng layout */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500">
              Tiêu chí
            </div>

            <div className="py-1">
              {SORT_OPTIONS.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors
                      ${
                        active
                          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
