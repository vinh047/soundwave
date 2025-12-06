// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Prisma } from "@repo/database";

// interface TrackItemProps {
//   track: Prisma.TrackGetPayload<{ include: { user: true } }>;
// }

// const TrackItem = ({ track }: TrackItemProps) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       className="w-44 shrink-0 cursor-pointer group relative"
//     >
//       {/* Ảnh track */}
//       <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-neutral-800">
//         <Image
//           src={track.imagePath || "/default-track-cover.jpg"}
//           alt={track.title}
//           fill
//           className="object-cover transition-transform duration-300 group-hover:scale-105"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
//         />
//         <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>

//       {/* Tiêu đề */}
//       <p className="mt-2 truncate font-semibold text-sm text-white group-hover:text-orange-400 transition-colors">
//         {track.title}
//       </p>

//       {/* Tác giả */}
//       <p className="truncate text-xs text-gray-400">
//         {track.user?.name || "Unknown Artist"}
//       </p>
//     </motion.div>
//   );
// };

// interface HorizontalTrackListProps {
//   title: string;
//   tracks: Prisma.TrackGetPayload<{ include: { user: true } }>[];
// }

// const HorizontalTrackList = ({ title, tracks }: HorizontalTrackListProps) => {
//   return (
//     <section className="mb-10">
//       <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>

//       <div
//         className="
//           flex overflow-x-auto space-x-4 pb-3 pr-4
//           scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
//           hover:scrollbar-thumb-gray-500
//         "
//       >
//         {tracks.map((track) => (
//           <TrackItem key={track.id} track={track} />
//         ))}

//         <div className="shrink-0 w-4" />
//       </div>
//     </section>
//   );
// };

// export default HorizontalTrackList;
