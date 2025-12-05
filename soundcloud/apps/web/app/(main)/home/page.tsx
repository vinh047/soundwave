import { TrackList } from "@/components/track/TrackList";
import { Button } from "@/components/ui2/Button";
import trackApi from "@/lib/api/trackApi";
import { Footer } from "./_components/Footer";

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
          <h3 className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider mb-4">
            Go Mobile
          </h3>
        </div>
      </div>
      <Footer />
    </div>
  );
}
