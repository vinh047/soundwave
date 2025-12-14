"use client";

import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { UserAvatarPlaceholder } from "../placeholders/UserAvatar";
import { format } from "date-fns";

interface FollowUserItemProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
  };
  relationType: "follower" | "following";
  followedAt?: Date; // Add this optional prop
}

export default function FollowUserItem({
  user,
  relationType,
  followedAt, // Destructure it
}: FollowUserItemProps) {
  const defaultAvatar = "/images/default-avatar.png";

  const dateLabel = relationType === "follower" ? "Followed" : "Since";

  // Use followedAt if available, otherwise fallback to user.createdAt (or handle as needed)
  // But for "Followed" context, followedAt is what we want.
  // If relationType is "following", it means "User started following this person at..." -> followedAt
  // If relationType is "follower", it means "This person started following User at..." -> followedAt

  const displayDate = followedAt ? new Date(followedAt) : new Date(user.createdAt);

  return (
    <div className="group flex flex-col items-center p-4 rounded-xl transition-all duration-300">
      {/* 1. Avatar tròn lớn (SoundCloud Style) */}
      <Link href={`/artist/${user.id}`} className="relative mb-3">
        {/* Tạo hiệu ứng viền cam khi hover giống SoundCloud */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full relative overflow-hidden shadow-md group-hover:shadow-[0_4px_20px_rgba(255,85,0,0.3)] transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#ff5500] bg-gray-100 dark:bg-zinc-800">
          {user.image ? (
            <Image
              src={user.image || defaultAvatar}
              alt={user.name || "User"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <UserAvatarPlaceholder />
          )}
        </div>
      </Link>

      {/* 2. Thông tin User (Căn giữa) */}
      <div className="text-center w-full mb-3">
        <Link
          href={`/artist/${user.id}`}
          className="text-base font-bold text-gray-900 dark:text-white hover:text-[#ff5500] truncate block px-2"
          title={user.name || "Unknown User"}
        >
          {user.name || "Unknown User"}
        </Link>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {dateLabel} {format(displayDate, "dd/MM/yyyy")}
        </p>
      </div>

      {/* 3. Action Button */}
      <FollowButton artistId={user.id} />
    </div>
  );
}
