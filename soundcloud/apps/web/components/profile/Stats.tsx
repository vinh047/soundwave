interface StatsProps {
  tracks: number;
  followers: number;
  following: number;
}

export function Stats({ tracks, followers, following }: StatsProps) {
  return (
    <div className="flex gap-8 text-sm">
      <div>
        <strong className="text-2xl font-bold">{tracks}</strong>
        <p className="text-gray-400">tracks</p>
      </div>
      <div>
        <strong className="text-2xl font-bold">{followers}</strong>
        <p className="text-gray-400">followers</p>
      </div>
      <div>
        <strong className="text-2xl font-bold">{following}</strong>
        <p className="text-gray-400">following</p>
      </div>
    </div>
  );
}