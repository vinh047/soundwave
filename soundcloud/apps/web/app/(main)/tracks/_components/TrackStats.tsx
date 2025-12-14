import { Play, Globe, Music, LucideIcon } from "lucide-react";
import { Track } from "@repo/database";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
      <Icon className={`w-5 h-5 `} />
    </div>
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
        {label}
      </p>
      <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </h4>
    </div>
  </div>
);

export const TracksStats = ({ tracks }: { tracks: Track[] }) => {
  const totalPlays = tracks.reduce(
    (acc, curr) => acc + (curr.playCount || 0),
    0
  );
  const publicTracks = tracks.filter((t) => t.isPublic).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <StatCard
        label="Tổng bài hát"
        value={tracks.length}
        icon={Music}
        color="bg-blue-500"
      />
      <StatCard
        label="Tổng lượt nghe"
        value={Number(totalPlays.toLocaleString())}
        icon={Play}
        color="bg-green-500"
      />
      <StatCard
        label="Công khai"
        value={publicTracks}
        icon={Globe}
        color="bg-purple-500"
      />
    </div>
  );
};
