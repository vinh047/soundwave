"use client";

import { Play, Pause, Search, Eye, EyeOff } from "lucide-react"; // 1. Import thêm icon Eye, EyeOff
import { useState, useRef, useEffect } from "react";

// Định nghĩa Interface để tránh lỗi TypeScript
interface Track {
  id: string;
  title: string;
  artist: string;
  plays: number;
  duration: string;
  image: string;
  isPublic: boolean;
  isBanned: boolean;
  url: string;
}

// Mock Data ban đầu
const INITIAL_TRACKS: Track[] = [
  { 
    id: "TRK001", 
    title: "Summer Vibes 2024", 
    artist: "DJ Snake", 
    plays: 12500, 
    duration: "6:12", 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    isPublic: true, // Đang hiện
    isBanned: false,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  { 
    id: "TRK002", 
    title: "Lofi Chill Study", 
    artist: "ChilledCow", 
    plays: 89000, 
    duration: "7:05", 
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop",
    isPublic: true, 
    isBanned: false,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  { 
    id: "TRK004", 
    title: "Copyrighted Track", 
    artist: "Bad User", 
    plays: 1200, 
    duration: "5:44", 
    image: "https://plus.unsplash.com/premium_photo-1677589330352-509c3d18f3a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c29uZyUyMGljb258ZW58MHx8MHx8fDA%3D",
    isPublic: false, // Đang ẩn (Riêng tư)
    isBanned: true,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
];

export default function TracksPage() {
  // 2. Chuyển đổi dữ liệu sang State để có thể chỉnh sửa
  const [trackList, setTrackList] = useState<Track[]>(INITIAL_TRACKS);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hàm xử lý phát nhạc (Giữ nguyên)
  const togglePlay = (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(track.url);
      audioRef.current.play().catch(e => console.error("Lỗi phát nhạc:", e));
      setPlayingId(track.id);
      audioRef.current.onended = () => setPlayingId(null);
    }
  };

  // 3. Hàm xử lý Ẩn/Hiện bài hát (Logic mới)
  const toggleVisibility = (id: string) => {
    setTrackList(prevTracks => prevTracks.map(track => {
      if (track.id === id) {
        // Đảo ngược trạng thái isPublic
        return { ...track, isPublic: !track.isPublic };
      }
      return track;
    }));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const filteredTracks = trackList.filter((track) => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Kho bài hát</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm bài hát, nghệ sĩ, ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-400 font-medium">
            <tr>
              <th className="px-4 py-3 w-24">ID</th>
              <th className="px-4 py-3 w-12 text-center">Play</th>
              <th className="px-4 py-3">Bài hát</th>
              <th className="px-4 py-3">Lượt nghe</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Ẩn/Hiện</th> {/* Cột mới */}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredTracks.length > 0 ? (
              filteredTracks.map((track) => (
                <tr key={track.id} className="group hover:bg-zinc-900/60 transition-colors">
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                    {track.id}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => togglePlay(track)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 group-hover:bg-orange-500 text-white transition-all"
                    >
                      {playingId === track.id ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={track.image} alt="" className="w-10 h-10 rounded object-cover bg-zinc-800" />
                      <div>
                        <div className="font-medium text-white">{track.title}</div>
                        <div className="text-xs text-zinc-500">{track.artist} • {track.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{track.plays.toLocaleString()}</td>
                  
                  <td className="px-4 py-3">
                    {track.isBanned ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        Đã cấm
                      </span>
                    ) : !track.isPublic ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-700 text-zinc-400 border border-zinc-600">
                        Riêng tư
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Công khai
                      </span>
                    )}
                  </td>

                  {/* Cột Chức năng Ẩn/Hiện */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisibility(track.id)}
                      className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                      title={track.isPublic ? "Nhấn để ẩn bài hát" : "Nhấn để hiện bài hát"}
                    >
                      {track.isPublic ? (
                        <Eye size={18} className="text-emerald-500" /> // Mắt mở (Màu xanh)
                      ) : (
                        <EyeOff size={18} className="text-zinc-500" /> // Mắt đóng (Màu xám)
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Không tìm thấy bài hát hay nghệ sĩ nào phù hợp với "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}