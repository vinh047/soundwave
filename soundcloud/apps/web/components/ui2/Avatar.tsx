import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt = "", size = 40, className }: AvatarProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-full bg-gray-700", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}