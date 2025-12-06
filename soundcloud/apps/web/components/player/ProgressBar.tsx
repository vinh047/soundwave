export function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number | null;
  onSeek: (time: number) => void;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex items-center gap-2 text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || undefined}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="flex-1 accent-[#f50] cursor-pointer"
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function formatTime(time: number | null) {
  if (!time || isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
