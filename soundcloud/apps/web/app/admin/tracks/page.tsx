"use client";

import { Play, Pause, Search, Eye, Ban, CheckCircle } from "lucide-react"; // 1. Import icon Ban và CheckCircle
import { useState } from "react";

const tracks = [
  { 
    id: "TRK001", 
    title: "Summer Vibes 2024", 
    artist: "DJ Snake", 
    plays: 12500, 
    duration: "3:45", 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    isPublic: true,
    isBanned: false 
  },
  { 
    id: "TRK002", 
    title: "Lofi Chill Study", 
    artist: "ChilledCow", 
    plays: 89000, 
    duration: "2:20", 
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop",
    isPublic: true,
    isBanned: false
  },
  { 
    id: "TRK004", 
    title: "Copyrighted Track", 
    artist: "Bad User", 
    plays: 1200, 
    duration: "3:10", 
    image: "https://images.unsplash.com/photo-1514525253440-b39333156162?w=100&h=100&fit=crop",
    isPublic: true,
    isBanned: true 
  },
];

export default function TracksPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  // Mock function để minh họa hành động Ban
  const handleToggleBan = (id: string, currentStatus: boolean) => {
    console.log(`Toggle ban for ${id}. New status: ${!currentStatus}`);
    // Sau này gọi API backend ở đây
  };

  const filteredTracks = tracks.filter((track) => 
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
              <th className="px-4 py-3 text-right">Hành động</th>
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
                      onClick={() => togglePlay(track.id)}
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
                  
                  {/* Cột Hành Động Mới */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Nút Xem chi tiết */}
                      <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Xem chi tiết">
                        <Eye size={18} />
                      </button>

                      {/* Nút Ban/Unban thay cho Thùng rác */}
                      {track.isBanned ? (
                        <button 
                          onClick={() => handleToggleBan(track.id, track.isBanned)}
                          className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors" 
                          title="Gỡ cấm (Cho phép hoạt động lại)"
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleBan(track.id, track.isBanned)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" 
                          title="Cấm bài hát này"
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </div>
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