"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui2/Dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui2/Tabs";
import { Input } from "@/components/ui2/Input";
import { Button } from "@/components/ui2/Button";
import playlistApi from "@/lib/api/playlistApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAddToPlaylistModal } from "@/store/useAddToPlaylistModal";
import { Loader2, Music, Lock, Globe } from "lucide-react"; // Thêm icon Lock/Globe
import Image from "next/image";

export function AddToPlaylistModal() {
  // 1. Lấy state từ Store
  const { isOpen, onClose, trackId } = useAddToPlaylistModal();

  const [activeTab, setActiveTab] = useState("add");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State cho Create Playlist
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { user } = useAuthStore();

  // 2. Xử lý khi mở Modal
  useEffect(() => {
    if (isOpen && user) {
      setNewPlaylistTitle("");
      setSearchQuery("");
      fetchPlaylists();

      // 👇 LOGIC MỚI: Tự động chọn tab phù hợp
      if (trackId) {
        setActiveTab("add"); // Có bài hát -> Mở tab Add
      } else {
        setActiveTab("create"); // Không có bài hát -> Mở tab Create/Manage
      }
    }
  }, [isOpen, user, trackId]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const res = await playlistApi.getMyPlaylists();
      setPlaylists(res.data);
    } catch (error) {
      console.error("Failed to fetch playlists", error);
      toast.error("Không thể tải danh sách playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!trackId) return;
    try {
      await playlistApi.addTrackToPlaylist(playlistId, trackId);
      toast.success("Đã thêm bài hát vào playlist!");
      onClose();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Thêm thất bại (có thể bài hát đã tồn tại)";
      toast.error(msg);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) return;
    try {
      const res = await playlistApi.createPlaylist({
        title: newPlaylistTitle,
        isPublic,
      });

      // Chỉ thêm bài hát nếu có trackId
      if (trackId && res.data?.id) {
        await playlistApi.addTrackToPlaylist(res.data.id, trackId);
        toast.success(`Đã tạo playlist "${newPlaylistTitle}" và thêm bài hát.`);
      } else {
        toast.success(`Đã tạo playlist "${newPlaylistTitle}"`);
      }

      onClose();
    } catch (error) {
      toast.error("Tạo playlist thất bại");
    }
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#181818] text-white border-gray-800 p-0 overflow-hidden gap-0">
        {/* Header: Đổi Title dựa vào ngữ cảnh */}
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {trackId ? "Add to playlist" : "Playlist Manager"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Menu */}
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
              <TabsTrigger
                value="add"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f50] data-[state=active]:text-[#f50] py-3 text-base transition-all"
              >
                {trackId ? "Add to playlist" : "My Playlists"}
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f50] data-[state=active]:text-[#f50] py-3 text-base transition-all"
              >
                Create new
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: DANH SÁCH (ADD HOẶC VIEW) */}
          <TabsContent
            value="add"
            className="p-6 pt-4 space-y-4 m-0 min-h-[300px]"
          >
            <Input
              placeholder="Find playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#333] border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#f50]"
            />

            <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-[#f50]" />
                </div>
              ) : filteredPlaylists.length > 0 ? (
                filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-2 hover:bg-[#333] rounded cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                        {playlist.tracks?.[0]?.track?.imagePath ? (
                          <Image
                            src={playlist.tracks[0].track.imagePath}
                            alt={playlist.title}
                            className="w-full h-full object-cover"
                            fill
                          />
                        ) : (
                          <Music size={16} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate pr-2">
                          {playlist.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{playlist._count?.tracks || 0} tracks</span>
                          {/* Hiện icon Public/Private */}
                          {playlist.isPublic ? (
                            <Globe size={10} />
                          ) : (
                            <Lock size={10} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 👇 CHỈ HIỆN NÚT ADD NẾU CÓ BÀI HÁT */}
                    {trackId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity border-gray-600 hover:bg-[#f50] hover:text-white hover:border-[#f50] text-gray-300 h-8 text-xs"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                      >
                        Add
                      </Button>
                    ) : (
                      // Nếu không có bài hát, hiện trạng thái thay vì nút bấm
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {playlist.isPublic ? "Public" : "Private"}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8 text-sm flex flex-col items-center">
                  <Music className="w-8 h-8 mb-2 opacity-50" />
                  {searchQuery
                    ? "No playlists found."
                    : "You have no playlists."}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: CREATE NEW */}
          <TabsContent
            value="create"
            className="p-6 pt-4 space-y-4 m-0 min-h-[300px]"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Playlist title <span className="text-[#f50]">*</span>
              </label>
              <Input
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                className="bg-[#333] border-none text-white focus-visible:ring-1 focus-visible:ring-[#f50]"
                placeholder="My awesome playlist"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePlaylist();
                }}
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-sm font-medium text-gray-300">
                Privacy:
              </span>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-[#333] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="w-4 h-4 accent-[#f50]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium flex items-center gap-2">
                      Public <Globe size={12} className="text-gray-400" />
                    </span>
                    <span className="text-xs text-gray-400">
                      Anyone can find and view this playlist
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-[#333] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="w-4 h-4 accent-[#f50]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium flex items-center gap-2">
                      Private <Lock size={12} className="text-gray-400" />
                    </span>
                    <span className="text-xs text-gray-400">
                      Only you can view this playlist
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-auto">
              <Button
                className="bg-[#f50] hover:bg-[#d40] text-white font-medium px-6"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistTitle.trim()}
              >
                {trackId ? "Create & Add" : "Create Playlist"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
