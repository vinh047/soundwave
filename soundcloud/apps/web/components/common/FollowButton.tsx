"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import userApi from "@/lib/api/usersApi";
import { useAuthStore } from "@/store/authStore";

interface FollowButtonProps {
  artistId: string;
  variant?: "solid" | "outline";
  className?: string;
}

export default function FollowButton({ artistId, variant = "outline", className = "" }: FollowButtonProps) {
  const { user } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= check follow status ================= */
  useEffect(() => {
    if (!user) return;

    const checkStatus = async () => {
      try {
        const res = await userApi.checkFollow(artistId);
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Check follow failed", error);
      }
    };

    checkStatus();
  }, [artistId, user]);

  /* ================= follow / unfollow ================= */
  const handleToggleFollow = async () => {
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
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  // Không hiển thị nếu là chính mình
  if (user?.id === artistId) return null;

  /* ================= UI ================= */
  const baseStyles = "flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  const outlineStyles = `
    px-6 py-1.5 min-w-[100px] rounded-lg border
    ${isFollowing
      ? "border-[#ff5500] text-[#ff5500]"
      : "border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:border-[#ff5500] hover:text-[#ff5500]"
    }
  `;

  const solidStyles = `
    px-4 py-2 rounded-[3px] text-sm font-bold shadow-md uppercase tracking-wide
    ${isFollowing
      ? "bg-white text-[#ff5500] border border-[#ff5500]"
      : "bg-[#ff5500] hover:bg-[#e04b00] text-white"
    }
  `;

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`${baseStyles} ${variant === "solid" ? solidStyles : outlineStyles} ${className}`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck size={18} />
          <span className={variant === "solid" ? "hidden md:inline" : ""}>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={18} />
          <span className={variant === "solid" ? "hidden md:inline" : ""}>Follow</span>
        </>
      )}
    </button>
  );
}
