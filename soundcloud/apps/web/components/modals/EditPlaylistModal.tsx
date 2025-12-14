"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui2/Dialog";
import { Button } from "@/components/ui2/Button";
import { Input } from "@/components/ui2/Input";
import { Prisma } from "@repo/database";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
import playlistApi from "@/lib/api/playlistApi";
import { toast } from "sonner";

type PlaylistWithTracks = Prisma.PlaylistGetPayload<{
    include: {
        tracks: { include: { track: { include: { user: true } } } };
    };
}>;

interface EditPlaylistModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    playlist: PlaylistWithTracks;
    onUpdate: () => void;
}

export default function EditPlaylistModal({
    isOpen,
    onOpenChange,
    playlist,
    onUpdate,
}: EditPlaylistModalProps) {
    const [title, setTitle] = useState(playlist.title);
    const [tracks, setTracks] = useState(playlist.tracks || []);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state when playlist changes
    useEffect(() => {
        setTitle(playlist.title);
        setTracks(playlist.tracks || []);
    }, [playlist]);

    const handleSave = async () => {
        if (!title.trim()) return toast.error("Playlist title cannot be empty");
        setIsLoading(true);
        try {
            await playlistApi.updatePlaylist(playlist.id, { title });
            toast.success("Playlist updated");
            onUpdate();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update playlist:", error);
            toast.error("Failed to update playlist");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTrack = async (trackId: string) => {
        try {
            await playlistApi.removeTrackFromPlaylist(playlist.id, trackId);
            setTracks((prev) => prev.filter((t) => t.trackId !== trackId));
            toast.success("Track removed from playlist");
            onUpdate(); // Refresh parent data (optional, but good for consistency)
        } catch (error) {
            console.error("Failed to remove track:", error);
            toast.error("Failed to remove track");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#121212] border-gray-200 dark:border-zinc-800">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Playlist</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Playlist name"
                                className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                            />
                        </div>

                        {/* Track List */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tracks ({tracks.length})
                            </label>
                            <div className="space-y-1">
                                {tracks.map((item) => (
                                    <div
                                        key={item.track.id}
                                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800/50 group"
                                    >
                                        <div className="relative h-10 w-10 min-w-[40px] rounded overflow-hidden bg-gray-200 dark:bg-zinc-800">
                                            {item.track.imagePath && (
                                                <Image
                                                    src={item.track.imagePath}
                                                    alt={item.track.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                                                {item.track.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {item.track.user?.name}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveTrack(item.track.id)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ))}
                                {tracks.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No tracks in this playlist.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
