"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui2/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui2/Tabs";
import { Input } from "@/components/ui2/Input";
import { Button } from "@/components/ui2/Button";
import { Avatar } from "@/components/ui2/Avatar";
import playlistApi from "@/lib/api/playlistApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface AddToPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    trackId: string | null;
}

export function AddToPlaylistModal({
    isOpen,
    onClose,
    trackId,
}: AddToPlaylistModalProps) {
    const [activeTab, setActiveTab] = useState("add");
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        if (isOpen && user) {
            fetchPlaylists();
        }
    }, [isOpen, user]);

    const fetchPlaylists = async () => {
        try {
            const res = await playlistApi.getMyPlaylists();
            setPlaylists(res.data);
        } catch (error) {
            console.error("Failed to fetch playlists", error);
        }
    };

    const handleAddToPlaylist = async (playlistId: string) => {
        if (!trackId) return;
        try {
            await playlistApi.addTrackToPlaylist(playlistId, trackId);
            toast.success("Added to playlist");
            onClose();
        } catch (error) {
            toast.error("Failed to add to playlist (maybe already exists)");
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistTitle.trim()) return;
        try {
            const res = await playlistApi.createPlaylist({
                title: newPlaylistTitle,
                isPublic,
            });

            // If we have a track, add it immediately
            if (trackId && res.data?.id) {
                await playlistApi.addTrackToPlaylist(res.data.id, trackId);
                toast.success("Playlist created and track added");
            } else {
                toast.success("Playlist created");
            }

            setNewPlaylistTitle("");
            onClose();
        } catch (error) {
            toast.error("Failed to create playlist");
        }
    };

    const filteredPlaylists = playlists.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-[#181818] text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Add to playlist
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
                        <TabsTrigger
                            value="add"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f50] data-[state=active]:text-[#f50] py-3"
                        >
                            Add to playlist
                        </TabsTrigger>
                        <TabsTrigger
                            value="create"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#f50] data-[state=active]:text-[#f50] py-3"
                        >
                            Create a playlist
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="add" className="mt-4 space-y-4">
                        <Input
                            placeholder="Filter playlists"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#333] border-none text-white placeholder:text-gray-400"
                        />

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {filteredPlaylists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className="flex items-center justify-between p-2 hover:bg-[#333] rounded cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                                            {playlist.tracks?.[0]?.track?.imagePath ? (
                                                <img
                                                    src={playlist.tracks[0].track.imagePath}
                                                    alt={playlist.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-600">
                                                    <span className="text-xs">♪</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{playlist.title}</span>
                                            <span className="text-xs text-gray-400">
                                                {playlist._count?.tracks || 0} tracks
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity border-gray-600 hover:bg-gray-700 text-white"
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                    >
                                        Add to Playlist
                                    </Button>
                                </div>
                            ))}
                            {filteredPlaylists.length === 0 && (
                                <div className="text-center text-gray-500 py-4 text-sm">
                                    No playlists found.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="create" className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Playlist title *</label>
                            <Input
                                value={newPlaylistTitle}
                                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                className="bg-[#333] border-none text-white"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm">Privacy:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="public"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                    className="accent-[#f50]"
                                />
                                <label htmlFor="public" className="text-sm cursor-pointer">
                                    Public
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="private"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                    className="accent-[#f50]"
                                />
                                <label htmlFor="private" className="text-sm cursor-pointer">
                                    Private
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                className="bg-[#f50] hover:bg-[#d40] text-white"
                                onClick={handleCreatePlaylist}
                                disabled={!newPlaylistTitle.trim()}
                            >
                                Save
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
