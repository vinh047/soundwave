"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Play, 
  Share2, 
  MoreHorizontal, 
  Copy, 
  ListMusic,
  LucideIcon 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- TYPES ---

interface PlaylistTrackData {
  id: string;
  order: number;
  track: {
    id: string;
    title: string;
    imagePath?: string | null;
    playCount: number;
    user?: { name?: string | null }; 
  };
}

interface PlaylistData {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string | Date;
  user: { 
    id: string; 
    name: string | null 
  }; 
  tracks: PlaylistTrackData[];
  _count?: {
    tracks: number;
  };
}

interface SearchPlaylistCardProps {
  playlist: PlaylistData;
}

export function SearchPlaylistCard({ playlist }: SearchPlaylistCardProps) {
  // Lấy danh sách 5 bài đầu tiên
  const previewTracks = playlist.tracks || [];
  const totalTracks = playlist._count?.tracks || 0;

  // 👇 SỬA LỖI 1: Object is possibly 'undefined'
  // Dùng Optional Chaining (?.) để truy cập an toàn
  const firstTrackImage = previewTracks[0]?.track?.imagePath;
  
  // Nếu có ảnh track đầu tiên thì dùng, không thì dùng ảnh mặc định
  const coverImage = firstTrackImage || "/images/default-playlist.png";

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/playlists/${playlist.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied playlist link to clipboard!");
  };

  return (
    <div className="flex gap-6 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg group border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
      
      {/* --- CỘT TRÁI: ẢNH BÌA --- */}
      <Link 
        href={`/playlists/${playlist.id}`} 
        className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 block cursor-pointer bg-gray-200 dark:bg-gray-800 rounded-sm"
      >
        <Image
          src={coverImage}
          alt={playlist.title}
          fill
          className="object-cover shadow-md rounded-sm hover:opacity-90 transition-opacity"
        />
        
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <ListMusic className="w-3 h-3" />
            {totalTracks}
        </div>
      </Link>

      {/* --- CỘT PHẢI: THÔNG TIN --- */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md shrink-0">
                    <Play className="w-5 h-5 ml-1 fill-current" />
                </button>

                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        {playlist.user?.name || "Unknown User"}
                    </span>
                    <Link 
                        href={`/playlists/${playlist.id}`} 
                        className="text-base font-medium text-gray-900 dark:text-gray-200 hover:text-black dark:hover:text-white truncate block max-w-[300px]"
                    >
                        {playlist.title}
                    </Link>
                </div>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {playlist.createdAt ? formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true }) : ""}
            </span>
        </div>

        {/* TRACK LIST PREVIEW */}
        <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden mb-3 bg-white dark:bg-black/20">
            {previewTracks.length > 0 ? (
                previewTracks.map((item, index) => (
                    <div 
                        key={item.id} 
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group/track text-sm border-b last:border-b-0 border-gray-100 dark:border-gray-800"
                    >
                        <div className="w-6 h-6 shrink-0 relative flex items-center justify-center text-gray-400 text-xs bg-gray-100 dark:bg-gray-800 rounded-sm">
                             {item.track.imagePath ? (
                                <Image src={item.track.imagePath} alt="track" fill className="object-cover rounded-sm opacity-80" />
                             ) : (
                                <span>{index + 1}</span>
                             )}
                        </div>

                        <div className="flex items-center gap-1 flex-1 min-w-0 text-gray-700 dark:text-gray-300">
                            <span className="text-gray-500 text-xs truncate max-w-[100px]">
                                {item.track.user?.name || "Unknown"}
                            </span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className="font-medium truncate">{item.track.title}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                            <Play className="w-3 h-3" />
                            {item.track.playCount?.toLocaleString() || 0}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-xs text-gray-500 italic">
                    No tracks yet.
                </div>
            )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-auto flex items-center justify-between">
             <div className="h-6 flex items-center"> 
                {totalTracks > 5 && (
                    <Link href={`/playlists/${playlist.id}`} className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        View all {totalTracks} tracks
                    </Link>
                )}
             </div>
             
             <div className="flex items-center gap-2">
                <ActionButton icon={Share2} label="Share" />
                <ActionButton icon={Copy} label="Copy Link" onClick={handleCopyLink} />
                <ActionButton icon={MoreHorizontal} label="More" />
            </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENT ---

// 👇 SỬA LỖI 2: Unexpected any
// Thay 'any' bằng 'LucideIcon'
interface ActionButtonProps {
    icon: LucideIcon; 
    label: string;
    onClick?: (e: React.MouseEvent) => void;
}

function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 dark:border-gray-700 rounded-[3px] text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors bg-transparent"
        >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    )
}