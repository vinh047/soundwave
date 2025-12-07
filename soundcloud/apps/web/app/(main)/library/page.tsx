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
import { Loader2 } from "lucide-react";
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
                // Map RecentListen to Track
                const recent = recentRes.data.map((item) => item.track);
                setRecentTracks(recent as unknown as TrackWithUser[]);

                // 2. User Data (Likes, Following, etc.)
                // Note: getUserById returns a lot, we might want to optimize this later
                // or use specific endpoints if available.
                // For now, let's use what we have.
                const userDetailsRes = await userApi.getUserById(user.id);
                const userDetails = userDetailsRes.data;

                if (userDetails) {
                    // Likes
                    // userDetails.likes is array of Like objects, we need the tracks
                    // Wait, getUserById includes likes: true, but does it include the track inside the like?
                    // Let's check the API definition again.
                    // userApi.getUserById include: { likes: true } -> returns Like[]
                    // We need Like & { track: Track }
                    // The current userApi.getUserById definition in the file I read ONLY includes `likes: true`.
                    // It does NOT include the track relation inside the like.
                    // So we might not get the liked tracks details from here.
                    // We might need to fetch liked tracks separately or update the API.
                    // For now, let's assume we might need a new endpoint or use `getPopularTracksByUserId` as a placeholder?
                    // No, `getPopularTracksByUserId` returns tracks created by user.

                    // Let's try to fetch playlists
                    const playlistsRes = await userApi.getPlaylistsByUserId(user.id);
                    setPlaylists(playlistsRes.data.data);

                    // Following
                    // userDetails.following is Follow[]
                    // We need the user details of the people being followed.
                    // Again, check if `following` include relations.
                    // The API definition: `following: true`.
                    // This usually just returns the relation table data (followerId, followingId).
                    // We need `following: { include: { following: true } }` to get the user data.
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
                        <TabsList className="h-auto w-full justify-start gap-6 bg-transparent p-0">
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
                                    className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 text-base font-medium text-gray-500 hover:text-gray-900 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 dark:text-gray-400 dark:hover:text-white"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-8">
                            <TabsContent value="overview" className="space-y-12">
                                {/* Recently Played */}
                                <Section title="Recently played">
                                    {recentTracks.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                                    {/* Placeholder for Likes since we need to fix the API */}
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {/* Dummy skeletons or empty for now */}
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-md bg-gray-200 dark:bg-gray-800"
                                            />
                                        ))}
                                    </div>
                                </Section>

                                {/* Playlists */}
                                <Section title="Playlists">
                                    {playlists.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                                                    <h3 className="truncate font-medium text-gray-900 dark:text-white">
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
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {/* Placeholder */}
                                        <div className="flex flex-col items-center">
                                            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-2"></div>
                                            <span className="text-sm font-medium">Artist Name</span>
                                        </div>
                                    </div>
                                </Section>

                            </TabsContent>

                            {/* Other tabs content placeholders */}
                            <TabsContent value="likes">
                                <EmptyState message="Your liked tracks will appear here." />
                            </TabsContent>
                            <TabsContent value="playlists">
                                <EmptyState message="Your playlists will appear here." />
                            </TabsContent>
                            <TabsContent value="albums">
                                <EmptyState message="Your albums will appear here." />
                            </TabsContent>
                            <TabsContent value="stations">
                                <EmptyState message="Your stations will appear here." />
                            </TabsContent>
                            <TabsContent value="following">
                                <EmptyState message="People you follow will appear here." />
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
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
