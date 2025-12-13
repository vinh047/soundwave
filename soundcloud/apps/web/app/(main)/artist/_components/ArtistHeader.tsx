"use client";

import Image from "next/image";
import { useState } from "react";
import { UserPlus, MessageSquare, Pencil, BadgeCheck } from "lucide-react";
import { Prisma } from "@repo/database";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { useAuth } from "@/app/contexts/AuthContext";
import ShareModal from "@/components/modals/ShareModal";

interface ArtistHeaderProps {
  user: Prisma.UserGetPayload<{
    include: {
      profile: {
        include: {
          websiteProfiles: {
            include: {
              websiteType: true;
            };
          };
        };
      };
    };
  }>;
}

export default function ArtistHeader({ user }: ArtistHeaderProps) {
  const { user: currentUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isOwner = currentUser?.id === user.id;

  // TODO: Remove this cast once Prisma client is regenerated to include coverUrl
  const coverImage =
    (user.profile as any)?.coverUrl || "https://picsum.photos/id/10/1200/400";

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://yourdomain.com/users/${user.id}`; // Fallback URL
  const shareTitle = user.name
    ? `Check out ${user.name}'s profile on YourPlatform`
    : "Check out this amazing artist!";

  return (
    <>
      <div className="relative w-full bg-[#333] group mb-16 md:mb-20">
        {/* ... (Phần Cover Image giữ nguyên) ... */}
        <div className="relative h-[260px] md:h-80 w-full">
          <Image
            src={coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          {/* Thêm nút Edit Cover nhanh nếu là Owner (Optional) */}
          {isOwner && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition opacity-0 group-hover:opacity-100 border border-white/20"
            >
              <Pencil size={14} /> Update Image
            </button>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent group-hover:bg-black/40 transition duration-500"></div>
        </div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8 pointer-events-none">
          {/* Actions Bar */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20 items-end pointer-events-auto">
            {/* === LOGIC HIỂN THỊ NÚT === */}
            {isOwner ? (
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-[3px] text-sm font-bold transition shadow-md uppercase tracking-wide"
              >
                <Pencil size={18} />
                <span className="hidden md:inline">Edit</span>
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-[3px] text-sm font-bold transition shadow-md uppercase tracking-wide">
                <UserPlus size={18} />
                <span className="hidden md:inline">Follow</span>
              </button>
            )}
            {/* =========================== */}

            <ShareModal shareUrl={shareUrl} shareTitle={shareTitle} />

            {/* Chỉ hiện nút nhắn tin nếu KHÔNG phải là chủ sở hữu */}
            {!isOwner && (
              <button className="flex items-center justify-center w-9 h-9 bg-transparent border border-gray-400 hover:border-white text-white hover:bg-white/10 rounded-[3px] transition">
                <MessageSquare size={18} />
              </button>
            )}
          </div>

          {/* ... (Phần Avatar & Info giữ nguyên) ... */}
          <div className="absolute bottom-0 left-4 md:left-8 flex flex-col md:flex-row items-end gap-6 w-full">
            <div
              className="relative translate-y-1/2 z-30 shrink-0 cursor-pointer"
              onClick={() => isOwner && setIsEditOpen(true)}
            >
              <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white p-1 shadow-xl rounded-md group/avatar">
                <div className="relative w-full h-full bg-gray-200 rounded-xs overflow-hidden">
                  <Image
                    src={user.image || "/images/default-avatar.png"}
                    alt={user.name || "Artist"}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay Edit Avatar */}
                  {isOwner && (
                    <div className="absolute inset-0 bg-black/40 hidden group-hover/avatar:flex items-center justify-center text-white font-medium text-xs">
                      Update
                    </div>
                  )}
                </div>
              </div>
              {/* ... Badge ... */}
            </div>

            {/* ... Text Info ... */}
            <div className="flex-1 pb-6 md:pb-8 z-20 md:pl-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-4xl font-bold text-white shadow-black drop-shadow-md bg-black/40 px-3 py-1 rounded backdrop-blur-sm inline-block">
                  {user.name || "Unknown Artist"}
                </h1>
                {/* Verification Badge */}
                <div className="bg-white rounded-full p-0.5 shadow-sm" title="Verified Artist">
                  <BadgeCheck size={24} className="text-blue-500 fill-white" />
                </div>
              </div>
              {user.profile?.location && (
                <p className="text-gray-200 text-sm mt-2 bg-black/30 px-2 py-0.5 rounded inline-block backdrop-blur-sm font-medium">
                  {user.profile.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER MODAL TẠI ĐÂY */}
      {isOwner && (
        <EditProfileModal
          user={user}
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}
