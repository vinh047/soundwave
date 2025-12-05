// "use client";

// import { useState, useRef, useEffect, useMemo } from "react";
// // Giả sử @repo/database đã export Track và JsonValue
// import { Track } from "@repo/database";
// import {
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   Heart,
//   Repeat,
//   MessageCircle,
//   Share2,
//   Plus,
//   MoreVertical,
// } from "lucide-react";
// import Image from "next/image";


// export default function TrackPlayer({ track }: { track: Track }) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0); // Khởi tạo 0, để audio element cập nhật
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   /**
//    * ✅ SỬA LỖI KIỂM TRA KIỂU DỮ LIỆU CHO WAVEFORM
//    * Kiểm tra xem track.waveform có phải là Array of Numbers hợp lệ hay không.
//    */
//   const waveformData = useMemo(() => {
//     // Ép kiểu JsonValue thành mảng tiềm năng
//     const data = track.waveform as unknown as number[] | null | undefined;

//     // Kiểm tra: phải là mảng VÀ tất cả phần tử là số (để tránh lỗi TypeScript)
//     if (Array.isArray(data) && data.every((item) => typeof item === "number")) {
//       return data;
//     }

//     // Trả về dữ liệu waveform giả nếu không có
//     return Array.from({ length: 400 }, () => Math.random() * 0.9 + 0.1);
//   }, [track.waveform]);

//   // Dùng useRef để lưu trữ dữ liệu waveform sau khi đã kiểm tra/tạo dummy
//   const waveformRef = useRef<number[]>(waveformData);

//   // --- LOGIC AUDIO PLAYER EVENTS ---
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);
//     const handleEnded = () => {
//       setIsPlaying(false);
//       setCurrentTime(0);
//       // Tùy chọn: reset audio.currentTime về 0
//       if (audio) audio.currentTime = 0;
//     };

//     // Cập nhật duration chính xác sau khi metadata được tải
//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration);
//     };

//     const handleTimeUpdate = (e: Event) => {
//       setCurrentTime((e.target as HTMLAudioElement).currentTime);
//     };

//     audio.addEventListener("play", handlePlay);
//     audio.addEventListener("pause", handlePause);
//     audio.addEventListener("ended", handleEnded);
//     audio.addEventListener("loadedmetadata", handleLoadedMetadata);
//     audio.addEventListener("timeupdate", handleTimeUpdate);

//     return () => {
//       audio.removeEventListener("play", handlePlay);
//       audio.removeEventListener("pause", handlePause);
//       audio.removeEventListener("ended", handleEnded);
//       audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
//       audio.removeEventListener("timeupdate", handleTimeUpdate);
//     };
//   }, []);

//   // --- LOGIC VẼ WAVEFORM (Chạy lại khi currentTime, duration thay đổi) ---
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // Đảm bảo dữ liệu waveform đã sẵn sàng
//     const waveform = waveformRef.current;

//     const rect = canvas.getBoundingClientRect();
//     canvas.width = rect.width;
//     canvas.height = rect.height;

//     const ctx = canvas.getContext("2d")!;
//     const { width, height } = canvas;

//     ctx.clearRect(0, 0, width, height);

//     const step = width / waveform.length;
//     const progress = duration > 0 ? currentTime / duration : 0;

//     for (let i = 0; i < waveform.length; i++) {
//       const amp = waveform[i] ?? 0;
//       // Chiều cao thanh (amp từ 0 đến 1)
//       const barHeight = amp * height * 0.9;
//       const x = i * step;
//       const y = (height - barHeight) / 2;

//       // Màu sắc: Màu progress hoặc màu nền
//       ctx.fillStyle = i / waveform.length < progress ? "#4ecdc4" : "#444";
//       ctx.fillRect(x, y, step * 0.8, barHeight);
//     }
//   }, [currentTime, duration]); // Phụ thuộc vào currentTime và duration

//   // --- CONTROLS ---

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current
//         .play()
//         .catch((e) => console.error("Error playing audio:", e));
//     }
//     // Dù sao thì trạng thái isPlaying sẽ được cập nhật bởi event listener
//   };

//   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     // Tính toán vị trí click theo tỷ lệ (0 đến 1)
//     const percent = (e.clientX - rect.left) / rect.width;
//     if (audioRef.current && duration > 0) {
//       const newTime = percent * duration;
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const handleSkip = (direction: "forward" | "back", seconds: number = 15) => {
//     if (audioRef.current && duration > 0) {
//       const newTime =
//         direction === "forward"
//           ? audioRef.current.currentTime + seconds
//           : audioRef.current.currentTime - seconds;

//       // Đảm bảo thời gian không vượt quá giới hạn
//       const safeNewTime = Math.max(0, Math.min(duration, newTime));

//       audioRef.current.currentTime = safeNewTime;
//       setCurrentTime(safeNewTime);
//     }
//   };

//   const formatTime = (secs: number) => {
//     if (isNaN(secs) || secs < 0) return "0:00";
//     const m = Math.floor(secs / 60);
//     const s = Math.floor(secs % 60)
//       .toString()
//       .padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // --- GIAO DIỆN HIỂN THỊ ---
//   return (
//     <div className="flex flex-col gap-6 h-[85vh] overflow-auto scrollbar-none">
//       {/* 1. Waveform Display */}
//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//         <div
//           className="relative h-36 bg-black/30 rounded-xl overflow-hidden cursor-pointer"
//           onClick={handleSeek} // Cho phép click để tua
//         >
//           <canvas ref={canvasRef} className="w-full" />
//         </div>
//         <p className="text-center text-xs text-gray-400 mt-2">
//           320kbps • **Waveform**
//         </p>
//       </div>

//       {/* 2. Player Controls */}
//       <div className="flex flex-col items-center gap-4">
//         <div className="flex items-center gap-6">
//           {/* Nút Skip Back */}
//           <button
//             onClick={() => handleSkip("back", 15)} // Tua lùi 15s
//             className="text-gray-400 hover:text-white transition"
//           >
//             <SkipBack size={20} />
//           </button>

//           {/* Nút Play/Pause */}
//           <button
//             onClick={togglePlay}
//             className="w-16 h-16 rounded-full bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
//           >
//             {isPlaying ? (
//               <Pause size={28} fill="black" color="black" />
//             ) : (
//               <Play size={28} fill="black" color="black" className="ml-1" />
//             )}
//           </button>

//           {/* Nút Skip Forward */}
//           <button
//             onClick={() => handleSkip("forward", 15)} // Tua tiến 15s
//             className="text-gray-400 hover:text-white transition"
//           >
//             <SkipForward size={20} />
//           </button>
//         </div>

//         {/* Thời gian & Play Count */}
//         <div className="text-sm text-gray-400 flex items-center gap-2">
//           <span>{formatTime(currentTime)}</span>
//           <span>/</span>
//           <span>{formatTime(duration)}</span>
//           <span className="ml-4 flex items-center gap-1">
//             <Play size={14} /> {track.playCount.toLocaleString()} plays
//           </span>
//         </div>
//       </div>

//       {/* 3. Action Buttons */}
//       <div className="flex flex-wrap justify-center gap-3">
//         {[
//           { icon: Heart, label: "45,821" },
//           { icon: Repeat, label: "12,453" },
//           { icon: MessageCircle, label: "892" },
//           { icon: Share2, label: "Share" },
//           { icon: Plus, label: "" },
//           { icon: MoreVertical, label: "" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             // Thêm onClick handlers cho các hành động thực tế tại đây
//             onClick={() => console.log(`Action: ${btn.label || "More"}`)}
//             className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition cursor-pointer"
//           >
//             <btn.icon size={16} />
//             {btn.label && <span>{btn.label}</span>}
//           </button>
//         ))}
//       </div>

//       {/* 4. Thống kê tổng quan */}
//       <p className="text-center text-xs text-gray-400">
//         45,821 likes • 12,453 reposts • 892 comments • Posted 2 days ago
//       </p>

//       {/* 5. About Section */}
//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//         <h3 className="text-lg font-bold mb-3">About this track</h3>
//         <p className="text-gray-300 leading-relaxed">
//           {track.description || "No description provided."}
//         </p>
//         <div className="flex gap-2 flex-wrap mt-4">
//           {["#Electronic", "#electronic", "#ambient"].map((tag) => (
//             <span
//               key={tag}
//               className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* 6. Comments Section */}
//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
//         <h3 className="text-lg font-bold mb-4">Comments</h3>

//         {/* --- Ô nhập comment --- */}
//         <div className="flex items-start gap-3 mb-6">
//           <Image
//             src={track.imagePath || "/images/default-cover.jpg"}
//             alt={track.title}
//             width={36}
//             height={36}
//             className="rounded-full object-cover"
//           />
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Write a comment..."
//               className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]"
//             />
//           </div>
//           <button className="bg-[#4ecdc4] text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition">
//             Post
//           </button>
//         </div>

//         {/* --- Danh sách comment --- (Giữ nguyên dữ liệu mẫu) */}
//         <div className="space-y-5">
//           {/* ... Phần hiển thị comment mẫu ... */}
//         </div>
//       </div>

//       {/* Thẻ Audio ẩn */}
//       <audio ref={audioRef} src={track.audioPath || "/SoundHelix-Song-1.mp3"} />
//     </div>
//   );
// }
