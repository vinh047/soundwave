// import { Track as TrackType } from "@repo/database";
// import Image from "next/image";
// import { PlayCircle } from "lucide-react";

// interface TrackItemProps {
//   track: TrackType;
// }

// /** 🎯 Thành phần hiển thị 1 track (Chuẩn Dark Mode) */
// const TrackItem = ({ track }: TrackItemProps) => {
//   const artistName = track.userId || "Unknown Artist";

//   return (
//     <div className="w-44 shrink-0 cursor-pointer group">
//       {/* Khu vực ảnh */}
//       <div className="relative w-full aspect-square rounded-lg mb-3 overflow-hidden bg-gray-200 dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all">
//         <Image
//           src={track.imagePath || "/default-track-cover.jpg"}
//           alt={track.title}
//           className="object-cover transition-transform duration-500 group-hover:scale-110"
//           fill
//         />
//         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
//           <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
//         </div>
//       </div>

//       {/* Tiêu đề & Tác giả: Text color thay đổi theo theme */}
//       <p className="truncate font-bold text-sm mt-2 text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-white transition-colors">
//         {track.title}
//       </p>
//       <p className="truncate text-xs text-gray-500 dark:text-gray-400">
//         {artistName}
//       </p>
//     </div>
//   );
// };
// export default TrackItem;
