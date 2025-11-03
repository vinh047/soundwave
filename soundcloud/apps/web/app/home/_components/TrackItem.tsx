import { Track as TrackType } from "@repo/database";
import Image from "next/image";
import { PlayCircle } from "lucide-react"; // 🎵 Thêm icon Play (cần cài lucide-react)

interface TrackItemProps {
  track: TrackType;
}

/** 🎯 Thành phần hiển thị 1 track (tối ưu hóa) */
const TrackItem = ({ track }: TrackItemProps) => {
  // Thay thế tên tác giả cứng bằng dữ liệu thực tế nếu có, hoặc để trống
  const artistName = track.userId || "Nghệ sĩ ẩn danh";

  return (
    // group: Đánh dấu là 1 nhóm để dùng group-hover bên trong
    <div className="w-40 shrink-0 cursor-pointer group">
      {/* Khu vực ảnh và hiệu ứng hover */}
      <div className="relative w-full aspect-square rounded-lg mb-3 overflow-hidden shadow-md">
        {/* Vùng Ảnh */}
        <Image
          src={track.imagePath || "/default-track-cover.jpg"}
          alt={track.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="160px" // Chiều rộng cố định, nên dùng sizes nhỏ để tối ưu
        />

        {/* Lớp phủ & Icon Play */}
        {/* opacity-0 -> opacity-100 khi hover | scale-75 -> scale-100 khi hover */}
        <div
          className="
          absolute inset-0 
          bg-black/30 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
          flex items-center justify-center
        "
        >
          <PlayCircle className="text-white fill-white/80 w-10 h-10 transition-transform duration-300 group-hover:scale-100 scale-75" />
        </div>
      </div>

      {/* Tiêu đề */}
      <p
        className="
        truncate font-bold text-sm 
        text-gray-900 dark:text-gray-100 
        hover:text-blue-600 transition-colors
      "
      >
        {track.title}
      </p>

      {/* Tác giả */}
      <p
        className="
        truncate text-xs 
        text-gray-500 dark:text-gray-400 
        hover:text-gray-700 dark:hover:text-gray-300 transition-colors
      "
      >
        {artistName}
      </p>
    </div>
  );
};

export default TrackItem;
