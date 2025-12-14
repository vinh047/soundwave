"use client";

import { Prisma } from "@repo/database";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePlayerStore } from "@/store/playerStore";

type TrackWithUser = Prisma.TrackGetPayload<{ include: { user: true } }>;

interface PlaylistTrackListProps {
    tracks: { track: TrackWithUser }[];
}

export function PlaylistTrackList({ tracks }: PlaylistTrackListProps) {
    const { setQueue } = usePlayerStore();

    if (!tracks || tracks.length === 0) {
        return <div className="text-gray-500 py-8">No tracks in this playlist yet.</div>;
    }

    const handlePlay = (trackId: string) => {
        const allTracks = tracks.map((t) => t.track);
        setQueue(allTracks, trackId);
    };

    return (
        <div className="flex flex-col w-full">
            {tracks.map((item, index) => {
                const track = item.track;
                return (
                    <div
                        key={track.id}
                        onClick={() => handlePlay(track.id)}
                        className="group flex items-center gap-3 py-2 px-3 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-md transition-colors cursor-pointer"
                    >
                        {/* Image & Play Button Overlay */}
                        <div className="relative h-10 w-10 min-w-[40px] overflow-hidden rounded bg-gray-200 dark:bg-zinc-800">
                            {track.imagePath ? (
                                <Image
                                    src={track.imagePath}
                                    alt={track.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-400 to-red-500 text-white text-xs font-bold">
                                    ♪
                                </div>
                            )}

                            {/* Hover Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={16} className="text-white fill-white" />
                            </div>
                        </div>

                        {/* Index */}
                        <span className="text-sm text-gray-400 w-6 text-center group-hover:hidden">
                            {index + 1}
                        </span>
                        <span className="text-sm text-gray-400 w-6 text-center hidden group-hover:block">
                            <Play size={12} className="inline" />
                        </span>


                        {/* Title & Artist */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 truncate hover:underline cursor-pointer">
                                    {track.user?.name || "Unknown Artist"}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {track.title}
                                </span>
                            </div>
                        </div>

                        {/* Play Count */}
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Play size={10} />
                            {track.playCount?.toLocaleString() || 0}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
