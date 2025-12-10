export default function StaticWaveform({
  height = "h-6",
}: {
  height?: string;
}) {
  return (
    <div
      className={`${height} flex items-end gap-0.5 opacity-60 overflow-hidden`}
    >
      {Array.from({ length: 30 }).map((_, i) => {
        const h = Math.max(20, Math.abs(Math.sin(i * 132)) * 100);
        return (
          <div
            key={i}
            className="w-1 bg-gray-400 dark:bg-gray-500 rounded-sm"
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}
