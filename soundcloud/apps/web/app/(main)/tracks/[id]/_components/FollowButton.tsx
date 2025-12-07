"use client";

import { useState, useEffect } from "react";
import userApi from "@/lib/api/usersApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface FollowButtonProps {
    artistId: string;
}

export default function FollowButton({ artistId }: FollowButtonProps) {
    const { user } = useAuthStore();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            try {
                const res = await userApi.checkFollow(artistId);
                setIsFollowing(res.data.isFollowing);
            } catch (error) {
                console.error("Failed to check follow status", error);
            }
        };
        checkStatus();
    }, [artistId, user]);

    const handleFollow = async () => {
        if (!user) {
            toast.error("Please login to follow artists");
            return;
        }

        setLoading(true);
        try {
            if (isFollowing) {
                await userApi.unfollowUser(artistId);
                setIsFollowing(false);
                toast.success("Unfollowed artist");
            } else {
                await userApi.followUser(artistId);
                setIsFollowing(true);
                toast.success("Followed artist");
            }
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setLoading(false);
        }
    };

    if (user?.id === artistId) return null; // Hide if own profile

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all ${isFollowing
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4]"
                }`}
        >
            {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow Artist"}
        </button>
    );
}
