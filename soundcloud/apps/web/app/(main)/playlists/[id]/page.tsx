"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import ShareModal from "@/components/modals/ShareModal";
import { PlaylistHeader } from "@/components/playlist/PlaylistHeader";
import { PlaylistTrackList } from "@/components/playlist/PlaylistTrackList";
import { Button } from "@/components/ui2/Button";
import playlistApi from "@/lib/api/playlistApi";
import { Prisma } from "@repo/database";
import { Loader2, Share, Copy, Edit, Heart, ListFilter, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PlaylistWithDetails = Prisma.PlaylistGetPayload<{
    include: {
        user: true;
        tracks: { include: { track: { include: { user: true } } } };
        _count: { select: { tracks: true } };
    };
}>;

export default function PlaylistPage() {
    const params = useParams();
    const { user } = useAuth();
    const [playlist, setPlaylist] = useState<PlaylistWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!params.id) return;
            try {
                const res = await playlistApi.getPlaylistById(params.id as string);
                setPlaylist(res.data as any);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylist();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-500">
                Playlist not found.
            </div>
        );
    }

    const isOwner = user?.id === playlist.userId;

    return (
        <div className="min-h-screen bg-white pb-20 text-gray-900 dark:bg-[#121212] dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                {/* Header */}
                <PlaylistHeader playlist={playlist as any} />

                {/* Action Bar */}
                <div className="mt-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-2">
                        <ShareModal
                            shareUrl={shareUrl}
                            shareTitle={playlist.title}
                            trigger={
                                <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    <Share size={18} />
                                </Button>
                            }
                        />
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                            <Copy size={18} />
                        </Button>
                        {isOwner && (
                            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                                <Edit size={18} />
                            </Button>
                        )}
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                            <Heart size={18} />
                        </Button>
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                            <ListFilter size={18} />
                        </Button>
                        {isOwner && (
                            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800">
                                <Trash2 size={18} />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
                    {/* Left Sidebar: User Info */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full mb-3">
                            {playlist.user?.image ? (
                                <Image
                                    src={playlist.user.image}
                                    alt={playlist.user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {playlist.user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {playlist.user?.name || "Unknown User"}
                        </h3>
                        {/* Removed "Go Mobile" and "Playlists from this user" as requested */}
                    </div>

                    {/* Right Content: Tags & Tracks */}
                    <div className="flex flex-col gap-6">
                        {/* Tags (Mock) */}
                        <div className="flex flex-wrap gap-2">
                            {["#Electronic", "#House", "#Moombahton", "#Electro House"].map(tag => (
                                <span key={tag} className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Description / Add Tags CTA */}
                        <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-md border border-gray-100 dark:border-zinc-800">
                            <p className="text-gray-900 dark:text-white font-medium mb-1">
                                Here are some tags to get you started.
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Add tags to help people find your playlist.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">Cancel</Button>
                                <Button size="sm" className="bg-white text-black hover:bg-gray-200">Save</Button>
                            </div>
                        </div>

                        {/* Track List */}
                        <PlaylistTrackList tracks={playlist.tracks as any} />

                        <div className="flex justify-center mt-8">
                            <div className="h-8 w-8 animate-pulse bg-gray-300 dark:bg-zinc-800 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
