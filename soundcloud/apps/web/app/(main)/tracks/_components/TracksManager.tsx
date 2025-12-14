"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Music,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Prisma, Track } from "@repo/database";

import { Button } from "@/components/ui2/Button";
import { Input } from "@/components/ui2/Input";
import { useAuth } from "@/app/contexts/AuthContext";
import trackApi from "@/lib/api/trackApi";

import EditTrackModal from "@/components/modals/EditTrackModal";
import { TracksStats } from "./TrackStats";
import { TrackGridItem, TrackListItem } from "./TrackItems";
import SortDropdown, { SortOption } from "./SortDropdown";

type ViewMode = "grid" | "list";

export default function TracksManager() {
  const router = useRouter();
  const { user } = useAuth();

  /* -------------------- DATA -------------------- */
  const [tracks, setTracks] = useState<
    Prisma.TrackGetPayload<{
      include: {
        user: true;
        likes: true;
        reposts: true;
        _count: {
          select: { likes: true; reposts: true; comments: true };
        };
      };
    }>[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- UI STATE -------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  /* -------------------- MODAL -------------------- */
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* -------------------- FETCH -------------------- */

  const fetchTracks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await trackApi.getTracksByUserId(user.id);
      setTracks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bài hát");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id: string) => {
    toast.promise(
      async () => {
        await trackApi.deleteTrack(id);
        setTracks((prev) => prev.filter((t) => t.id !== id));
      },
      {
        loading: "Đang xoá...",
        success: "Đã xoá bài hát",
        error: "Xoá bài hát thất bại",
      }
    );
  };

  /* -------------------- FILTER + SORT -------------------- */
  const processedTracks = useMemo(() => {
    let result = [...tracks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "plays":
          return (b.playCount || 0) - (a.playCount || 0);
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [tracks, searchQuery, sortOption]);

  /* ======================== RENDER ======================== */
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
    
          <h2 className="text-zinc-500 text-lg">
            Chào mừng trở lại, {user?.name || "Nghệ sĩ"}
          </h2>
        </div>

        <Button
          onClick={() => router.push("/upload")}
          className="bg-orange-500 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg px-6 py-6 shadow-lg font-semibold cursor-pointer"
        >
          <Plus className="mr-2 h-5 w-5" />
          Tải lên mới
        </Button>
      </div>

      {/* ================= STATS ================= */}
      <TracksStats tracks={tracks} />

      {/* ================= TOOLBAR ================= */}
      <div className="bg-white dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 sticky top-4 z-20 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              placeholder="Tìm kiếm tác phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-100/50 dark:bg-zinc-800/50 border-transparent focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <SortDropdown value={sortOption} onChange={setSortOption} />

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {/* View Mode */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-700 text-orange-600 shadow"
                    : "text-zinc-500"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-700 text-orange-600 shadow"
                    : "text-zinc-500"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
          <p className="text-zinc-500">Đang tải dữ liệu...</p>
        </div>
      ) : processedTracks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <Music className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
          <h3 className="font-semibold text-lg">Chưa có bài hát</h3>
          <p className="text-zinc-500 mb-6">
            Hãy tải lên tác phẩm đầu tiên của bạn
          </p>
          <Button onClick={() => router.push("/upload")}>Tải lên ngay</Button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {processedTracks.map((track) => (
                <TrackGridItem
                  key={track.id}
                  track={track}
                  onEdit={() => {
                    setEditingTrack(track);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className=" overflow-hidden"
            >
              {processedTracks.map((track, index) => (
                <TrackListItem
                  key={track.id}
                  track={track}
                  isLast={index === processedTracks.length - 1}
                  onEdit={() => {
                    setEditingTrack(track);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ================= MODAL ================= */}
      {editingTrack && (
        <EditTrackModal
          track={editingTrack}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={fetchTracks}
        />
      )}
    </div>
  );
}
