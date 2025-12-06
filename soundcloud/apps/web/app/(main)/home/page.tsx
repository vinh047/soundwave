import { TrackList } from "@/components/track/TrackList";
import { Button } from "@/components/ui2/Button";
import trackApi from "@/lib/api/trackApi";
import { Footer } from "./_components/Footer";
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const api = await searchParams;
  const initTracks = await trackApi.getTracks({
    page: Number(api.page) || 1,
    limit: 10,
  });
  const data = initTracks.data.data;
  return (
    <div className="bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className=" grid grid-cols-1 lg:grid-cols-[1fr_350px] px-4 md:px-20 gap-8 ">
        <div className="w-[60vw] mx-auto  py-8">
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-neutral-900">
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9')] bg-cover bg-center" />
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

          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Just dropped
              </h2>
              <Button variant="outline">Xem tất cả</Button>
            </div>

            <TrackList tracks={data} />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Trending now
            </h2>
            <TrackList tracks={data} />
          </section>
        </div>
        <div className="hidden lg:block border-l border-gray-200 dark:border-gray-800 pl-8 py-8">
          <div className="mt-8">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
              Trending Artists
            </h3>
            <ul className="space-y-4">
              {["SOOBIN", "AMEE", "Đen Vâu", "Hoàng Dũng"].map((artist) => (
                <li key={artist} className="flex items-center gap-3">
                  <Image
                    src={`https://picsum.photos/seed/${artist}/40/40`}
                    width={40}
                    height={40}
                    alt={artist}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {artist}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
              Top Tracks
            </h3>
            <ul className="space-y-3">
              {["Mất Kết Nối", "Em Xinh", "Anh Trai"].map((song, idx) => (
                <li key={song} className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">
                    {idx + 1}. {song}
                  </span>
                  <Button variant="ghost" size="sm">
                    ▶
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
