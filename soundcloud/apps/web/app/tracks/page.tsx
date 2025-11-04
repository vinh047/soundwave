import { TrackList } from "@/components/track/TrackList";
import trackApi from "@/lib/api/trackApi";

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams; // 👈 phải await trước khi dùng

  const initTracks = await trackApi.getTracks({
    page: Number(params.page) || 1,
    limit: 10,
  });

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tất cả bài hát</h1>
        <TrackList tracks={initTracks.data.data} />
      </div>
    </div>
  );
}
