import { Suspense } from "react";
import { Metadata } from "next";
import { TrackList } from "@/components/track/TrackList";
import trackApi from "@/lib/api/trackApi";
import { trackApiServer } from "@/lib/api/trackApi.server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = params.page || "1";

  return {
    title: `Kho Nhạc - Trang ${currentPage} | SoundCloud Clone`,
    description: "Khám phá hàng triệu bài hát mới nhất...",
    openGraph: {
      title: `Danh sách bài hát - Trang ${currentPage}`,
    },
  };
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Phần Tiêu đề này sẽ hiện ra NGAY LẬP TỨC (0ms delay) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tất cả bài hát</h1>
          <p className="text-gray-500 mt-2">
            Nghe những bản nhạc mới nhất hôm nay
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <TrackListFetcher page={page} />
        </Suspense>
      </div>
    </div>
  );
}

async function TrackListFetcher({ page }: { page: number }) {
  try {
    const response = await trackApiServer.getTracks({
      page: page,
      limit: 10,
    });

    const tracks = response?.data?.data || [];

    if (tracks.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">
          Không tìm thấy bài hát nào ở trang này.
        </div>
      );
    }

    return <TrackList tracks={tracks} />;
  } catch (error) {
    console.error("Lỗi fetch tracks:", error);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
        Đã có lỗi xảy ra khi tải danh sách bài hát. Vui lòng thử lại sau.
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-gray-100 h-24 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0" />{" "}
          {/* Ảnh bìa */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" /> {/* Tên bài */}
            <div className="h-3 bg-gray-200 rounded w-1/2" /> {/* Tên ca sĩ */}
          </div>
        </div>
      ))}
    </div>
  );
}
