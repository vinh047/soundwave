import Image from "next/image";
import {
  Play,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Calendar,
  Music,
} from "lucide-react";



// Import type từ DB (sửa lại đường dẫn nếu cần)
import { Prisma } from "@repo/database";
import { TrackListItemInteractive } from "../../artist/_components/TrackListItemInteractive";
import TrackActionsDropdown from "./TrackActionsDropdown";

// --- Interface Props ---
interface TrackItemProps {
  track: Prisma.TrackGetPayload<{
    include: {
      user: true;
      likes: true;
      reposts: true;
      _count: {
        select: { likes: true; reposts: true; comments: true };
      };
    };
  }>;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

interface TrackListItemProps extends TrackItemProps {
  isLast: boolean;
}

// --- Component 1: Grid View ---
export const TrackGridItem = ({ track, onEdit, onDelete }: TrackItemProps) => (
  <div className="group relative bg-white dark:bg-zinc-900 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    {/* Image Section */}
    <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      {track.imagePath ? (
        <Image
          src={track.imagePath}
          alt={track.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-300">
          <Music className="w-12 h-12" />
        </div>
      )}

      {/* Overlay Actions (Edit/Delete) */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
        <button
          onClick={onEdit}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-black text-white transition-all transform hover:scale-110"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(track.id)}
          className="p-3 bg-red-500/80 backdrop-blur-md rounded-full hover:bg-red-600 text-white transition-all transform hover:scale-110"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Status Icon (Public/Private) */}
      <div className="absolute top-3 right-3">
        {track.isPublic ? (
          <div className="bg-green-500/20 backdrop-blur-md p-1.5 rounded-full text-green-400">
            <Globe className="w-3 h-3" />
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-full text-zinc-400">
            <Lock className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>

    {/* Info Section */}
    <div className="p-4">
      <h3 className="font-bold text-zinc-900 dark:text-white truncate mb-1">
        {track.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(track.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <span className="flex items-center gap-1">
          <Play className="w-3 h-3" />
          {track.playCount || 0}
        </span>
      </div>
    </div>
  </div>
);

// --- Component 2: List View ---
export const TrackListItem = ({
  track,
  isLast,
  onEdit,
  onDelete,
}: TrackListItemProps) => (
  <div
    className={`p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group ${!isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
  >
    {/* Image */}
    <div className="relative w-full">
      <TrackListItemInteractive track={track} key={track.id} />

      {/* Actions Dropdown */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <TrackActionsDropdown 
          onEdit={onEdit}
          onDelete={() => onDelete(track.id)}
        />
      </div>
    </div>
  </div>
);
