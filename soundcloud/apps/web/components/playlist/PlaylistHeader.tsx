"use client";

import { Button } from "@/components/ui2/Button";
import { Prisma } from "@repo/database";
import { Play, Pause, Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type PlaylistWithDetails = Prisma.PlaylistGetPayload<{
    include: {
        user: true;
        tracks: { include: { track: true } };
        _count: { select: { tracks: true } };
    };
}>;

interface PlaylistHeaderProps {
    playlist: PlaylistWithDetails;
}

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Calculate total duration from tracks
    const totalDurationSeconds = playlist.tracks?.reduce((acc, curr) => acc + (curr.track.duration || 0), 0) || 0;

    // Helper to format duration
    const formatDuration = (seconds: number) => {
        if (!seconds) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const totalDuration = formatDuration(totalDurationSeconds);

    return (
        <div className="relative h-[340px] w-full overflow-hidden rounded-md bg-linear-to-r from-neutral-800 to-neutral-900 text-white">
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-start">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="h-8 w-8 fill-current" />
                            ) : (
                                <Play className="h-8 w-8 fill-current ml-1" />
                            )}
                        </button>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-bold bg-black/50 px-2 py-1 inline-block backdrop-blur-md">
                                {playlist.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-black/50 px-2 py-1 text-lg text-gray-300 backdrop-blur-md">
                                    {playlist.user?.name || "Unknown User"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                        {/* Created at date could go here */}
                        13 minutes ago
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="text-3xl font-bold">
                            {playlist.tracks?.length || 0}
                        </div>
                        <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                            Tracks
                        </div>
                        <div className="text-sm font-medium opacity-60">
                            {totalDuration}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="absolute right-6 top-6 bottom-6 w-[340px] bg-neutral-800 rounded-sm overflow-hidden shadow-2xl group cursor-pointer">
                {playlist.tracks?.[0]?.track?.imagePath ? (
                    <Image
                        src={playlist.tracks[0].track.imagePath}
                        alt={playlist.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-700">
                        <span className="text-6xl text-neutral-500">♪</span>
                    </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 whitespace-nowrap">
                    <Camera size={16} />
                    Upload image
                </div>
            </div>

            {/* Background Gradient/Image (Optional, can use the first track image as blurred bg) */}
            {playlist.tracks?.[0]?.track?.imagePath && (
                <div className="absolute inset-0 z-0 opacity-30 blur-3xl pointer-events-none">
                    <Image
                        src={playlist.tracks[0].track.imagePath}
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
}
