"use client";

import { Play, Pause, Search, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getAdminTracks, updateAdminTrackStatus } from "@/lib/api/adminApi";
import { AdminTrack } from "@/type/AdminTypes";
import { toast } from "sonner";

export default function TracksPage() {
  const [trackList, setTrackList] = useState<AdminTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const result = await getAdminTracks({
          page,
          limit: 10,
          search: searchTerm,
        });
        setTrackList(result.data);
        setTotalPages(Math.ceil(result.total / 10));
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
        toast.error("Failed to load tracks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchTracks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, searchTerm]);

  // Handle Play/Pause
  const togglePlay = (track: AdminTrack) => {
    // Note: AdminTrack might not have 'url' field directly visible in type definition 
    // but backend should return it if needed for preview. 
    // If backend doesn't return audio URL, we can't play it.
    // Assuming backend returns 'audioPath' or similar, but AdminTrack type only has basic info.
    // Let's check if we can construct URL or if we need to update type.
    // For now, let's assume we can't play if URL is missing, or we need to fetch detail.
    // Actually, looking at AdminTrack type, it doesn't have audio URL.
    // We might need to update backend to return audioPath or use a separate endpoint.
    // For this implementation, I will comment out play functionality or show a message.

    toast.info("Audio preview is not currently available in admin view.");

    // Code for playback if URL was available:
    /*
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      // audioRef.current = new Audio(track.audioPath); 
      // audioRef.current.play().catch(e => console.error("Lỗi phát nhạc:", e));
      // setPlayingId(track.id);
      // audioRef.current.onended = () => setPlayingId(null);
    }
    */
  };

  // Handle Ban/Unban
  const toggleVisibility = async (track: AdminTrack) => {
    try {
      const newStatus = !track.isBanned;
      await updateAdminTrackStatus(track.id, { isBanned: newStatus });

      // Update local state
      setTrackList(prev => prev.map(t =>
        t.id === track.id ? { ...t, isBanned: newStatus } : t
      ));

      toast.success(`Track ${newStatus ? 'banned' : 'unbanned'} successfully.`);
    } catch (error) {
      console.error("Failed to update track status:", error);
      toast.error("Failed to update track status.");
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
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
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin mr-2" /> Loading...
                  </div>
                </td>
              </tr>
            ) : trackList.length > 0 ? (
              trackList.map((track) => (
                <tr key={track.id} className="group hover:bg-zinc-900/60 transition-colors">
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">
                    {track.id.slice(0, 8)}...
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePlay(track)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800/50 group-hover:bg-orange-500/20 group-hover:text-orange-500 text-zinc-400 transition-all border border-zinc-700/50 group-hover:border-orange-500/50"
                    >
                      {playingId === track.id ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Placeholder image since AdminTrack might not have image */}
                      <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                        IMG
                      </div>
                      <div>
                        <div className="font-medium text-white">{track.title}</div>
                        <div className="text-xs text-zinc-500">
                          {track.user?.name || track.user?.email || "Unknown Artist"} • {new Date(track.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{track.playCount.toLocaleString()}</td>

                  <td className="px-4 py-3">
                    {track.isBanned ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Đã cấm
                      </span>
                    ) : !track.isPublic ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                        Riêng tư
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Công khai
                      </span>
                    )}
                  </td>


                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisibility(track)}
                      className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700/50"
                      title={track.isBanned ? "Bỏ cấm bài hát" : "Cấm bài hát"}
                    >
                      {track.isBanned ? (
                        <EyeOff size={18} className="text-rose-500" />
                      ) : (
                        <Eye size={18} className="text-zinc-500 hover:text-rose-500" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Không tìm thấy bài hát nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
        <div className="text-sm text-zinc-500">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}