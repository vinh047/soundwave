// import trackApi from "@/lib/api/trackApi";
// import { SearchParams } from "next/dist/server/request/search-params";
// import HorizontalTrackList from "./_components/HorizontalTrackList";
// import { Navbar } from "./_components/navbar";

// const LIMIT = 10;

// export default async function HomePage({
//   searchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   // Lấy dữ liệu tracks (có thể truyền page/limit nếu cần, nhưng tạm thời chỉ lấy page 1)
//   const initTracks = await trackApi.getTracks({
//     page: searchParams.page || 1,
//     limit: LIMIT,
//   });

//   // Giả lập thêm dữ liệu để có nhiều danh sách cuộn
//   const tracksList1 = initTracks.data.data;
//   const tracksList2 = tracksList1.slice(0, 5).reverse(); // Danh sách đảo ngược
//   const tracksList3 = tracksList1.slice(3); // Danh sách khác

//   return (
//     <main>
//       <div className="w-screen px-4 py-4 space-y-12">
//         <Navbar/>
//         {/* Danh sách 1: Nghe nhiều nhất */}
//         <HorizontalTrackList
//           title="🔥 Các Bản Nhạc Thịnh Hành"
//           tracks={tracksList1}
//         />

//         {/* Danh sách 2: Dành cho bạn */}
//         <HorizontalTrackList title="✨ Khám Phá Nổi Bật" tracks={tracksList2} />

//         {/* Danh sách 3: Album mới */}
//         <HorizontalTrackList title="🆕 Album Vừa Ra Mắt" tracks={tracksList3} />
//       </div>
//     </main>
//   );
// }

import { TrackCard } from "@/components/track/TrackCard";
import { TrackList } from "@/components/track/TrackList";
import { Button } from "@/components/ui2/Button";
import trackApi from "@/lib/api/trackApi";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const api = await searchParams;
  const initTracks = await trackApi.getTracks({
    page: api.page || 1,
    limit: 10,
  });
  const data = initTracks.data.data;
  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại</h1>
          <p className="text-gray-400 mb-8">Khám phá những bài hát mới nhất</p>
        </div>

        {/* Just Dropped */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Just dropped</h2>
            <Button variant="outline">Xem tất cả</Button>
          </div>
          <TrackList tracks={data} />
        </section>

        {/* Trending */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Trending now</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {data.slice(0, 5).map((track) => (
              <div key={track.id} className="min-w-[200px] shrink-0">
                <TrackCard track={track} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
