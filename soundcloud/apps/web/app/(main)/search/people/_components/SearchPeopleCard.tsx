"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserPlus, UserCheck, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
// 👇 Import API
import userApi from "@/lib/api/usersApi";
import { useAuthModal } from "@/hooks/use-auth-modal";

// --- TYPES ---
interface UserData {
  id: string;
  name: string | null;
  image: string | null;
  username?: string | null;
  location?: string | null;
  _count?: {
    followers: number;
    tracks?: number;
  };
  // Trạng thái follow được trả về từ API searchUsers
  isFollowed?: boolean;
}

interface SearchPeopleCardProps {
  user: UserData;
}

export function SearchPeopleCard({ user }: SearchPeopleCardProps) {
  const { user: currentUser } = useAuth();

  // 1. Khởi tạo state từ dữ liệu props (đã có isFollowed từ API search)
  const [isFollowing, setIsFollowing] = useState(user.isFollowed || false);
  const [followerCount, setFollowerCount] = useState(
    user._count?.followers || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const isMe = currentUser?.id === user.id;

  const authModal = useAuthModal();
  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn click vào thẻ cha (Link)
    e.stopPropagation();

    if (!currentUser) {
      authModal.onOpen();
      return;
    }

    if (isMe) return;

    setIsLoading(true);

    // 2. Optimistic Update: Cập nhật UI ngay lập tức trước khi gọi API
    const previousIsFollowing = isFollowing;
    const newIsFollowing = !isFollowing;

    setIsFollowing(newIsFollowing);
    setFollowerCount((prev) => (newIsFollowing ? prev + 1 : prev - 1));

    try {
      if (previousIsFollowing) {
        // Nếu đang follow -> Gọi Unfollow
        await userApi.unfollowUser(user.id);
        toast.success(`Đã bỏ theo dõi ${user.name}`);
      } else {
        // Nếu chưa follow -> Gọi Follow
        await userApi.followUser(user.id);
        toast.success(`Đang theo dõi ${user.name}`);
      }
    } catch (error) {
      // 3. Revert: Nếu lỗi thì hoàn tác lại trạng thái cũ
      setIsFollowing(previousIsFollowing);
      setFollowerCount((prev) => (previousIsFollowing ? prev + 1 : prev - 1));
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
      {/* --- PHẦN TRÁI: AVATAR & INFO --- */}
      <Link
        href={`/artist/${user.id}`}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        {/* Avatar Hình Tròn */}
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={user.image || "/images/default-avatar.png"}
            alt={user.name || "User"}
            fill
            className="object-cover rounded-full border border-gray-200 dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Thông tin User */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-500 transition-colors">
            {user.name || "Unknown User"}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
            {/* Địa điểm */}
            {user.location && (
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="w-3 h-3 shrink-0" />
                {user.location}
              </span>
            )}

            {/* Số người theo dõi */}
            <span className="flex items-center gap-1 shrink-0">
              <Users className="w-3 h-3" />
              {followerCount.toLocaleString()} followers
            </span>

            {/* Số bài hát */}
            {user._count?.tracks !== undefined && user._count.tracks > 0 && (
              <span className="hidden sm:flex items-center gap-1 shrink-0 before:content-['•'] before:mr-2 before:text-gray-300 dark:before:text-gray-600">
                {user._count.tracks} tracks
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* --- PHẦN PHẢI: NÚT FOLLOW --- */}
      {!isMe && (
        <button
          onClick={handleToggleFollow}
          disabled={isLoading}
          className={cn(
            "ml-4 px-4 py-1.5 text-xs font-semibold rounded-[3px] border transition-all flex items-center gap-1.5 shrink-0",
            // Style logic:
            isFollowing
              ? "border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600 bg-transparent" // Đang Follow (Outline Cam)
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-transparent" // Chưa Follow (Xám)
          )}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              Follow
            </>
          )}
        </button>
      )}
    </div>
  );
}
