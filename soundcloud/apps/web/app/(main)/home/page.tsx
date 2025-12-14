import { TrackList } from "@/components/track/TrackList";
import { Button } from "@/components/ui2/Button";
import trackApi from "@/lib/api/trackApi";
import { Footer } from "./_components/Footer";
import Image from "next/image";
import { RecentTracks } from "./_components/RecentTracks";
import userApi from "@/lib/api/usersApi";
import Link from "next/link";
import { HorizontalTrackCard } from "@/components/track/HorizontalTrackCard";
import { trackApiServer } from "@/lib/api/trackApi.server";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const api = await searchParams;

  const [initTracksRes, trendingTracksRes, trendingArtistsRes] =
    await Promise.all([
      trackApi.getTracks({
        page: Number(api.page) || 1,
        limit: 10,
      }),
      trackApiServer.getTrendingTracks(10),
      userApi.getTrendingArtists(5),
    ]);

  const data = initTracksRes.data.data;
  const trendingTracks = trendingTracksRes.data;

  const trendingArtists = trendingArtistsRes.data?.data || [];

  console.log("trendingTracksRes: ", trendingTracksRes)

  return (
    <div className="bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className=" grid grid-cols-1 lg:grid-cols-[1fr_350px] px-4 md:px-20 gap-8 ">
        <div className="w-[60vw] mx-auto  py-8">
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-neutral-900">
              <div className="absolute inset-0 opacity-50 bg-[url('/images/istockphoto-472328791-612x612.jpg')] bg-cover bg-center" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center px-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                It all starts with an upload.
              </h1>
              <Button className="w-fit bg-orange-500 border-none text-white hover:bg-orange-600">
                Upload Now
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Khám phá những bài hát mới nhất dành cho bạn
            </p>
          </div>

          <RecentTracks />

          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Just dropped
              </h2>
            </div>

            <TrackList tracks={data} />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Trending now
            </h2>
            <TrackList tracks={trendingTracks} />
          </section>
        </div>
        <div className="hidden lg:block border-l border-gray-200 dark:border-gray-800 pl-8 py-8">
          <div className="mt-8">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
              Trending Artists
            </h3>
            {trendingArtists.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>
            ) : (
              <ul className="space-y-4">
                {trendingArtists.map((artist) => (
                  <li key={artist.id}>
                    {/* Dùng Link để click vào xem profile */}
                    <Link
                      href={`/artist/${artist.id}`}
                      className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                    >
                      <Image
                        // Fallback nếu artist chưa có avatar
                        src={artist.image || "/placeholder-avatar.png"}
                        width={40}
                        height={40}
                        alt={artist.name || "Artist"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <span className="text-gray-900 dark:text-white font-medium truncate">
                        {artist.name || "Unknown Artist"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* --- TOP TRACKS (Sử dụng HorizontalTrackCard) --- */}
          <div className="mt-8">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
              Top Tracks
            </h3>

            <div className="flex flex-col gap-3">
              {/* Lấy 3 bài hát đầu tiên từ trendingTracks */}
              {trendingTracks.slice(0, 3).map((track: any) => (
                <HorizontalTrackCard
                  key={track.id}
                  track={{
                    id: track.id,
                    title: track.title,
                    imagePath: track.imagePath,
                    audioPath: track.audioPath,
                    user: {
                      id: track.user.id,
                      name: track.user.name || "Unknown Artist",
                    },
                    // Mapping dữ liệu thống kê từ API (có _count) sang Props của Card
                    stats: {
                      playCount: track.playCount || 0,
                      likeCount: track._count?.likes || 0,
                      repostCount: track._count?.reposts || 0,
                      commentCount: track._count?.comments || 0,
                    },
                  }}
                />
              ))}
            </div>

            {/* Fallback nếu không có dữ liệu */}
            {trendingTracks.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Chưa có bài hát nào.
              </p>
            )}
          </div>
          {/* <div className="mt-8">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
              Suggested Playlist
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white font-semibold mb-2">
                Chill Vibes
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nhạc thư giãn buổi tối
              </p>
              <Button className="mt-3 w-full bg-orange-500 text-white">
                Play
              </Button>
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
