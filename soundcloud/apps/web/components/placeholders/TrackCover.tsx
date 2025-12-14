// components/placeholders/TrackCover.tsx
import { Music2 } from "lucide-react";

interface TrackCoverPlaceholderProps {
  /**
   * Kích thước icon:
   * - number → px
   * - string → tailwind (vd: "1/3", "1/2", "40")
   */
  size?: number | string;
}

export function TrackCoverPlaceholder({
  size = "1/3",
}: TrackCoverPlaceholderProps) {
  const iconClass =
    typeof size === "string"
      ? `h-${size} w-${size}`
      : "";

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
      <Music2
        className={
          typeof size === "string"
            ? `text-zinc-500 dark:text-zinc-400 ${iconClass}`
            : "text-zinc-500 dark:text-zinc-400"
        }
        size={typeof size === "number" ? size : undefined}
      />
    </div>
  );
}
