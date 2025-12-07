import Image from "next/image";
import { Play, Heart, Share2, Repeat, MoreHorizontal } from "lucide-react";
import { Prisma } from "@repo/database";

// Định nghĩa kiểu dữ liệu Repost (bao gồm relation track và user của track đó)
type RepostWithRelations = Prisma.RepostGetPayload<{
  include: {
    track: {
      include: {
        user: true;
        likes: true;
        comments: true;
      };
    };
  };
}>;

interface RepostsTabProps {
  reposts: RepostWithRelations[];
}

export default function RepostsTab({ reposts }: RepostsTabProps) {
  if (reposts.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500 italic border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg bg-gray-50/50 dark:bg-white/5">
        <Repeat size={32} className="opacity-50 mb-2" />
        <p>This artist hasn&apos;t reposted any tracks yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reposts.map((repost) => {
        const track = repost.track;
        if (!track) return null; // Safety check

        return (
          <div key={repost.id} className="relative group">
            {/* Repost Indicator Label */}
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5 ml-1">
              <Repeat size={12} className="text-gray-400" />
              <span>
                Reposted {new Date(repost.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Track Card (Tương tự TracksTab nhưng có style hơi khác để phân biệt) */}
            <div className="flex gap-4 p-3 rounded-lg bg-white dark:bg-[#181818] border border-gray-100 dark:border-white/5 hover:border-[#ff5500]/50 hover:shadow-sm transition-all cursor-pointer">
              {/* Track Image */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 shrink-0 relative rounded overflow-hidden">
                <Image
                  src={track.imagePath || "/images/default-track.png"}
                  alt={track.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center backdrop-blur-[1px]">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ff5500] rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition">
                    <Play size={18} className="fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Track Info */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 hover:text-[#ff5500] transition-colors mb-0.5 truncate cursor-pointer">
                      {track.user?.name || "Unknown Artist"}
                    </p>
                    <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-[#ff5500] transition-colors">
                      {track.title}
                    </h4>
                  </div>
                  {/* Có thể thêm duration tại đây */}
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">
                    <Play size={10} className="fill-current" />
                    {track.playCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-[#ff5500] transition-colors">
                    <Heart size={12} />
                    {track.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <Share2 size={12} /> Share
                  </span>
                </div>
              </div>

              {/* More Option */}
              <div className="hidden group-hover:flex items-center px-2">
                <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
