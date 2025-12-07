"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { TrackCard } from "@/components/track/TrackCard";
import { Button } from "@/components/ui2/Button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui2/Tabs";
import trackApi from "@/lib/api/trackApi";
import userApi from "@/lib/api/usersApi";
import { Prisma } from "@repo/database";
import { Loader2, Play, Pause, Heart, MoreHorizontal, LayoutGrid, List, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types for our data
type TrackWithUser = Prisma.TrackGetPayload<{ include: { user: true } }>;
type Playlist = Prisma.PlaylistGetPayload<{}>;
type UserWithProfile = Prisma.UserGetPayload<{}>;

export default function LibraryPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    // Data states
    const [recentTracks, setRecentTracks] = useState<TrackWithUser[]>([]);
    const [likedTracks, setLikedTracks] = useState<TrackWithUser[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [following, setFollowing] = useState<UserWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                // 1. Recent Tracks
                const recentRes = await trackApi.getRecentTracks();
                setRecentTracks(recentRes.data);

                // 2. User Data (Likes, Following, etc.)
                // Note: getUserById returns a lot, we might want to optimize this later
                // or use specific endpoints if available.
                // For now, let's use what we have.
                const userDetailsRes = await userApi.getUserById(user.id);
                const userDetails = userDetailsRes.data;

                if (userDetails) {
                    // Likes
                    if (userDetails.likes && Array.isArray(userDetails.likes)) {
                        const tracks = userDetails.likes.map((like: any) => like.track);
                        setLikedTracks(tracks);
                    }

                    // Playlists
                    const playlistsRes = await userApi.getPlaylistsByUserId(user.id);
                    setPlaylists(playlistsRes.data.data);

                    // Following
                    if (userDetails.following && Array.isArray(userDetails.following)) {
                        const followedUsers = userDetails.following.map((follow: any) => follow.following);
                        setFollowing(followedUsers);
                    }
                }
            } catch (error) {
                console.error("Error fetching library data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn && user) {
            fetchData();
        } else if (!authLoading && !isLoggedIn) {
            setIsLoading(false);
        }
    }, [user, isLoggedIn, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Please log in to view your library</h2>
                <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20 text-gray-900 dark:bg-[#121212] dark:text-white transition-colors duration-300">
            <div className="px-4 py-8 md:px-8">
                <div className="mb-8 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="mb-6 text-4xl font-bold">Library</h1>

                    <Tabs
                        defaultValue="overview"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="h-auto w-full justify-start gap-8 bg-transparent p-0 border-b border-gray-800">
                            {[
                                "Overview",
                                "Likes",
                                "Playlists",
                                "Albums",
                                "Stations",
                                "Following",
                                "History",
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab.toLowerCase()}
                                    className="rounded-none border-b-2 border-transparent px-0 pb-4 pt-0 text-lg font-semibold text-gray-500 hover:text-gray-300 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 transition-colors"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-10">
                            <TabsContent value="overview" className="space-y-16">
                                {/* Recently Played */}
                                <Section title="Recently played">
                                    {recentTracks.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                            {recentTracks.slice(0, 6).map((track) => (
                                                <TrackCard key={track.id} track={track} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState message="You haven't listened to anything yet." />
                                    )}
                                </Section>

                                {/* Likes */}
                                <Section title="Likes">
                                    {likedTracks.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                            {likedTracks.slice(0, 6).map((track) => (
                                                <TrackCard key={track.id} track={track} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState message="You haven't liked any tracks yet." />
                                    )}
                                </Section>

                                {/* Playlists */}
                                <Section title="Playlists">
                                    {playlists.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                            {playlists.slice(0, 6).map((playlist) => (
                                                <Link
                                                    href={`/playlists/${playlist.id}`}
                                                    key={playlist.id}
                                                    className="group block"
                                                >
                                                    <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
                                                        {/* Placeholder image for playlist */}
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                            <span className="text-4xl">♪</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="truncate font-medium text-lg text-gray-900 dark:text-white">
                                                        {playlist.title}
                                                    </h3>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {user?.name}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState message="No playlists yet." />
                                    )}
                                </Section>

                                {/* Following */}
                                <Section title="Following">
                                    {following.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                            {following.slice(0, 6).map((followedUser) => (
                                                <Link
                                                    href={`/profile/${followedUser.id}`}
                                                    key={followedUser.id}
                                                    className="flex flex-col items-center group"
                                                >
                                                    <div className="h-40 w-40 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-orange-500 transition-all shadow-lg">
                                                        {followedUser.image ? (
                                                            <Image
                                                                src={followedUser.image}
                                                                alt={followedUser.name || "User"}
                                                                width={160}
                                                                height={160}
                                                                className="object-cover h-full w-full"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-5xl font-bold">
                                                                {followedUser.name?.[0]?.toUpperCase() || "U"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors text-center truncate w-full px-2">
                                                        {followedUser.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState message="You are not following anyone yet." />
                                    )}
                                </Section>

                            </TabsContent>

                            {/* Likes Tab */}
                            <TabsContent value="likes" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-medium text-gray-400">
                                        Hear the tracks you've liked:
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded p-1">
                                            <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-orange-500 shadow-sm">
                                                <LayoutGrid size={18} />
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-gray-500">
                                                <List size={18} />
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Filter"
                                                className="h-8 rounded bg-gray-100 dark:bg-zinc-800 border-none px-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-orange-500 w-48"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {likedTracks.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {likedTracks.map((track) => (
                                            <TrackCard key={track.id} track={track} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="You haven't liked any tracks yet." />
                                )}
                            </TabsContent>

                            {/* Playlists Tab */}
                            <TabsContent value="playlists">
                                <EmptyState message="Your playlists will appear here." />
                            </TabsContent>

                            {/* Albums Tab */}
                            <TabsContent value="albums">
                                <EmptyState message="Your albums will appear here." />
                            </TabsContent>

                            {/* Stations Tab */}
                            <TabsContent value="stations">
                                <EmptyState message="Your stations will appear here." />
                            </TabsContent>

                            {/* Following Tab */}
                            <TabsContent value="following" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-medium text-gray-400">
                                        Hear what the people you follow have posted:
                                    </h2>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Filter"
                                            className="h-8 rounded bg-gray-100 dark:bg-zinc-800 border-none px-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-orange-500 w-48"
                                        />
                                    </div>
                                </div>

                                {following.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {following.map((followedUser: any) => (
                                            <Link
                                                href={`/profile/${followedUser.id}`}
                                                key={followedUser.id}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className="h-40 w-40 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-orange-500 transition-all shadow-lg relative">
                                                    {followedUser.image ? (
                                                        <Image
                                                            src={followedUser.image}
                                                            alt={followedUser.name || "User"}
                                                            width={160}
                                                            height={160}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-5xl font-bold">
                                                            {followedUser.name?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center w-full px-2">
                                                    <span className="block text-base font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors truncate">
                                                        {followedUser.name}
                                                    </span>
                                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
                                                        <User size={12} />
                                                        <span>
                                                            {followedUser._count?.followers || 0} followers
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="You are not following anyone yet." />
                                )}
                            </TabsContent>
                            <TabsContent value="history">
                                <EmptyState message="Your listening history." />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
            </div>
            {children}
        </section>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
}
