// app/track/[id]/page.tsx
import { Prisma } from "@repo/database";
import trackApi from "@/lib/api/trackApi";
import Image from "next/image";
import TrackPlayer from "./TrackPlayer";
import UpNext from "./UpNext";

interface TrackPageProps {
  params: { id: string };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const res = await trackApi.getTrackById(params.id);
  const track: Prisma.TrackGetPayload<{ include: { user: true } }> = res.data;

  return (
    <article className="max-h-screen fixed w-screen bg-linear-to-b from-[#0a0a0f] to-[#0f0f1a] text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6 xl:gap-8">
          {/* LEFT: Artwork + Info */}
          <div className="flex flex-col gap-6 h-[85vh] overflow-auto scrollbar-none">
            <div className="relative group">
              <Image
                src={track.imagePath || "/images/default-cover.jpg"}
                alt={track.title}
                width={320}
                height={320}
                className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-[#4ecdc4] bg-clip-text text-transparent">
                  {track.title}
                </h1>
                <p className="text-xl font-semibold text-[#ff6b6b] mt-2">
                  @{track.user.name}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
                <InfoRow
                  label="Duration"
                  value={formatDuration(track.duration)}
                />
                <InfoRow label="Genre" value={"Unknown"} />
                <InfoRow label="Released" value={formatDate(track.createdAt)} />
                <InfoRow
                  label="Plays"
                  value={track.playCount.toLocaleString()}
                />

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4] w-3/5" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-lg">
                    {track?.user?.name?.toUpperCase() || "unknown"}
                  </div>
                  <div>
                    <p className="font-semibold">{track.user.name}</p>
                    <p className="text-sm text-gray-400">Music Producer</p>
                  </div>
                </div>

                <button className="w-full py-3 rounded-full bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4] font-bold text-black hover:scale-105 transition-transform">
                  Follow Artist
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: Player + Waveform */}
          <TrackPlayer track={track} />

          {/* RIGHT: Up Next */}
          <UpNext />
        </div>
      </div>
    </article>
  );
}

// Helper Components
function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
