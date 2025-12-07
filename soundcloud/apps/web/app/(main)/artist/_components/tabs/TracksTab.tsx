import Image from "next/image";
import { Play, Heart, Share2 } from "lucide-react";
import { Prisma } from "@repo/database";

// Định nghĩa Type chính xác cho Track (bao gồm relations nếu cần)
type TrackWithRelations = Prisma.TrackGetPayload<{
  include: { likes: true; reposts: true }
}>;

interface TracksTabProps {
  tracks: TrackWithRelations[];
  artistName: string | null;
}

export default function TracksTab({ tracks, artistName }: TracksTabProps) {
  if (tracks.length === 0) {
    return <div className="py-10 text-gray-500 text-center">No tracks found.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tracks.map((track) => (
        <div 
          key={track.id} 
          className="flex gap-3 p-3 bg-white dark:bg-[#181818] rounded border border-gray-200 dark:border-white/5 hover:border-[#ff5500] transition group cursor-pointer"
        >
          {/* Track Image */}
          <div className="w-16 h-16 bg-gray-300 shrink-0 relative rounded overflow-hidden">
            <Image 
              src={track.imagePath || "/images/default-track.png"} 
              alt={track.title} 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center">
              <Play size={24} className="text-white fill-current" />
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-gray-500 hover:underline">{artistName}</p>
            <h4 className="font-bold text-gray-900 dark:text-white truncate">{track.title}</h4>
            
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Play size={12} className="text-gray-400"/> {track.playCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-gray-400"/> {track.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition">
                <Share2 size={12} /> Share
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}