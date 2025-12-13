import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import trackApi from "@/lib/api/trackApi";
import userApi from "@/lib/api/usersApi";
import playlistApi from "@/lib/api/playlistApi";
import { Prisma } from "@repo/database";

// Export types để dùng ở các file khác
export type TrackWithUser = Prisma.TrackGetPayload<{ include: { user: true } }>;
export type PlaylistWithTracks = Prisma.PlaylistGetPayload<{
    include: {
        tracks: { include: { track: true } };
        _count: { select: { tracks: true } };
    };
}>;
export type UserWithProfile = Prisma.UserGetPayload<{}>;

export function useLibraryData() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    
    const [recentTracks, setRecentTracks] = useState<TrackWithUser[]>([]);
    const [likedTracks, setLikedTracks] = useState<TrackWithUser[]>([]);
    const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
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

                // 2. User Data (Likes, Following)
                const userDetailsRes = await userApi.getUserById(user.id);
                const userDetails = userDetailsRes.data;

                if (userDetails) {
                    if (userDetails.likes && Array.isArray(userDetails.likes)) {
                        const tracks = userDetails.likes.map((like: any) => like.track);
                        setLikedTracks(tracks);
                    }

                    const playlistsRes = await playlistApi.getMyPlaylists();
                    setPlaylists(playlistsRes.data as any);

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

    return {
        user,
        isLoggedIn,
        authLoading,
        isLoading,
        recentTracks,
        likedTracks,
        playlists,
        following
    };
}