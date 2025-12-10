import { Prisma } from "@repo/database";
import trackApi from "@/lib/api/trackApi";
import UpNext from "./_components/UpNext";
import TrackInteraction from "./_components/TrackInteraction";
import TrackCard from "./_components/TrackCard";
import { InfoRow } from "./_components/InfoRow";
import { formatDate, formatDuration } from "./_components/utils";
import FollowButton from "./_components/FollowButton";

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

import { notFound } from "next/navigation";

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  let track: Prisma.TrackGetPayload<{
    include: {
      user: true;
      likes: true;
      reposts: true;
      comments: { include: { user: true } };
    };
  }>;

  try {
    const res = await trackApi.getTrackById(id);
    track = res.data;
  } catch (error) {
    console.error("Error fetching track:", error);
    notFound();
  }

  return (
    <article className=" w-full transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-linear-to-b dark:from-[#0a0a0f] dark:to-[#0f0f1a] dark:text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 xl:gap-8">
          {/* LEFT COLUMN: Player, Info, Comments */}
          <div className="flex flex-col gap-6 h-[calc(100vh-100px)] overflow-y-auto scrollbar-none">
            {/* 1. Track Card (Player) */}
            <TrackCard track={track} />

            {/* 2. Info & Interaction Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 xl:gap-8">
              {/* Sidebar Info (Artist, Stats) */}
              <div className="space-y-6">
                <div className="p-5 space-y-4 rounded-xl bg-white border border-gray-200 shadow-sm dark:bg-white/5 dark:border-white/5 dark:shadow-none backdrop-blur-md">
                  <InfoRow
                    label="Duration"
                    value={formatDuration(track.duration)}
                  />
                  <InfoRow label="Genre" value={"Unknown"} />
                  <InfoRow
                    label="Released"
                    value={formatDate(track.createdAt)}
                  />
                  <InfoRow
                    label="Plays"
                    value={track.playCount.toLocaleString()}
                  />

                  {/* Thanh tiến trình màu sắc */}
                  <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4] w-3/5" />
                  </div>



                  {/* Artist Card */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-lg text-white shadow-md">
                      {track?.user?.name?.substring(0, 2).toUpperCase() || "UN"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold truncate dark:text-white text-gray-900">
                        {track.user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Music Producer
                      </p>
                    </div>
                  </div>

                  <FollowButton artistId={track.userId} />
                </div>
              </div>

              {/* Main Content (Description, Comments) */}
              <div className="flex flex-col gap-6">
                <TrackInteraction track={track} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Up Next */}
          <div className="h-[calc(100vh-100px)] lg:sticky lg:top-8">
            <UpNext />
          </div>
        </div>
      </div>
    </article>
  );
}
