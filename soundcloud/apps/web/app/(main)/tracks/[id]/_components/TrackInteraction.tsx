"use client";

import { Track, Like, Repost, Comment, User } from "@repo/database";
import {
  Heart,
  Repeat,
  MessageCircle,
  Share2,
  MoreVertical,
  Send,
  ListPlus,
  ListMusic,
  Flag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import trackApi from "@/lib/api/trackApi";
import { toast } from "sonner";
import { Avatar } from "@/components/ui2/Avatar";
import Link from "next/link";
import { usePlayerStore } from "@/store/playerStore";
import ShareModal from "@/components/modals/ShareModal";
import { useAuth } from "@/app/contexts/AuthContext";
import { useAddToPlaylistModal } from "@/store/useAddToPlaylistModal";
import { useAuthModal } from "@/hooks/use-auth-modal";
import ReportModal from "@/components/modals/ReportModal";

type TrackWithInteractions = Track & {
  user: User;
  likes: Like[];
  reposts: Repost[];
  comments: (Comment & { user: User })[];
};

function timeAgo(date: string | Date) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
}

export default function TrackInteraction({
  track,
}: {
  track: TrackWithInteractions;
}) {
  const { user } = useAuthStore();
  const { addToQueue } = usePlayerStore();
  const [likes, setLikes] = useState<Like[]>(track.likes || []);
  const [reposts, setReposts] = useState<Repost[]>(track.reposts || []);
  const [comments, setComments] = useState<(Comment & { user: User })[]>(
    track.comments || []
  );
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isLiked = user ? likes.some((l) => l.userId === user.id) : false;
  const isReposted = user ? reposts.some((r) => r.userId === user.id) : false;

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReport = () => {
    setIsMoreOpen(false); // Đóng menu More
    setIsReportModalOpen(true); // Mở Report Modal
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNextUp = () => {
    addToQueue(track as any);
    setIsMoreOpen(false);
    toast.success("Added to Next up");
  };

  const authModal = useAuthModal();

  const uploadModal = useAddToPlaylistModal();

  const handleAddToPlaylist = () => {
    if (!user) {
      authModal.onOpen();
    } else {
      uploadModal.onOpen(track.id);
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like tracks");

    // Optimistic update
    if (isLiked) {
      setLikes((prev) => prev.filter((l) => l.userId !== user.id));
    } else {
      setLikes((prev) => [...prev, { userId: user.id } as Like]);
    }

    try {
      if (isLiked) {
        await trackApi.unlikeTrack(track.id);
      } else {
        await trackApi.likeTrack(track.id);
      }
    } catch (e) {
      // Revert on error
      toast.error("Failed to update like");
      if (isLiked) {
        setLikes((prev) => [...prev, { userId: user.id } as Like]);
      } else {
        setLikes((prev) => prev.filter((l) => l.userId !== user.id));
      }
    }
  };

  const handleRepost = async () => {
    if (!user) return toast.error("Please login to repost tracks");

    // Optimistic update
    if (isReposted) {
      setReposts((prev) => prev.filter((r) => r.userId !== user.id));
    } else {
      setReposts((prev) => [...prev, { userId: user.id } as Repost]);
    }

    try {
      if (isReposted) {
        await trackApi.unrepostTrack(track.id);
      } else {
        await trackApi.repostTrack(track.id);
      }
    } catch (e) {
      toast.error("Failed to update repost");
      if (isReposted) {
        setReposts((prev) => [...prev, { userId: user.id } as Repost]);
      } else {
        setReposts((prev) => prev.filter((r) => r.userId !== user.id));
      }
    }
  };

  const handleComment = async () => {
    if (!user) return toast.error("Please login to comment");
    if (!commentText.trim()) return;

    setLoadingComment(true);
    try {
      const res = await trackApi.commentTrack(track.id, commentText);
      // Backend returns the comment. Since we updated service to include user, it should be there.
      // However, if the create method in controller doesn't return the included user, we might need to fetch or mock it.
      // TracksService.commentTrack includes user: true. So it's fine.
      setComments((prev) => [res.data as any, ...prev]);
      setCommentText("");
      toast.success("Comment posted");
    } catch (e) {
      toast.error("Failed to post comment");
    } finally {
      setLoadingComment(false);
    }
  };

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const actions = [
    {
      icon: Heart,
      label: likes.length > 0 ? likes.length.toLocaleString() : "Like",
      color: isLiked
        ? "text-[#ff5500] border-[#ff5500]"
        : "hover:text-[#ff5500] hover:border-[#ff5500]",
      onClick: handleLike,
      fill: isLiked,
    },
    {
      icon: Repeat,
      label: reposts.length > 0 ? reposts.length.toLocaleString() : "Repost",
      color: isReposted
        ? "text-[#00ff00] border-[#00ff00]"
        : "hover:text-[#00ff00] hover:border-[#00ff00]",
      onClick: handleRepost,
      fill: false,
    },
    {
      icon: MessageCircle,
      label: comments.length > 0 ? comments.length.toLocaleString() : "Comment",
      color: "hover:text-blue-500 hover:border-blue-500",
      onClick: () => document.getElementById("comment-input")?.focus(),
      fill: false,
    },
    {
      icon: Share2,
      label: "Share",
      color: "hover:text-white",
      onClick: () => {},
      fill: false,
      isShare: true, // Mark as Share button
    },
    {
      icon: MoreVertical,
      label: "More",
      color: "hover:text-white",
      onClick: () => setIsMoreOpen(!isMoreOpen), // Toggle menu
      fill: false,
      isMore: true, // Đánh dấu đây là nút More
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 2. Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {actions.map((btn, i) => {
          // Nếu là nút Share -> Wrap bằng ShareModal
          if (btn.isShare) {
            return (
              <ShareModal
                key={i}
                shareUrl={shareUrl}
                shareTitle={track.title}
                trigger={
                  <button
                    className={`flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-white/10 ${btn.color}`}
                  >
                    <btn.icon size={18} />
                    <span>{btn.label}</span>
                  </button>
                }
              />
            );
          }

          // Nếu là nút More -> Render logic riêng với Dropdown
          if (btn.isMore) {
            return (
              <div key={i} className="relative" ref={moreMenuRef}>
                <button
                  onClick={btn.onClick}
                  className={`flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-white/10 ${btn.color}`}
                >
                  <btn.icon size={18} />
                  <span>{btn.label}</span>
                </button>

                {/* DROPDOWN MENU */}
                {isMoreOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-md shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
                    <button
                      onClick={handleNextUp}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors"
                    >
                      <ListPlus className="w-4 h-4" />
                      Add to Next up
                    </button>

                    <button
                      onClick={handleAddToPlaylist}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors"
                    >
                      <ListMusic className="w-4 h-4" />
                      Add to Playlist
                    </button>

                    <hr className="my-1 border-gray-100 dark:border-[#333]/50" />
                    <button
                      onClick={handleReport}
                      className="w-full text-left px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      Report Track
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Các nút thường (Like, Repost...)
          return (
            <button
              key={i}
              onClick={btn.onClick}
              className={`flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-white/10 ${btn.color}`}
            >
              <btn.icon size={18} className={btn.fill ? "fill-current" : ""} />
              {btn.label && <span>{btn.label}</span>}
            </button>
          );
        })}
      </div>

      {/* 3. About Section */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 border border-gray-200 dark:border-white/5 rounded-xl">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-500 uppercase tracking-wider mb-3">
          Description
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
          {track.description || "No description provided."}
        </p>
        <div className="flex gap-2 flex-wrap mt-4">
          {["#Electronic", "#DeepHouse", "#Vocal"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/5 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Comments Section */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Comments ({comments.length})
        </h3>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <div className="shrink-0">
            <Avatar
              src={user?.image || ""}
              alt={user?.name || "User"}
              size={40}
            />
          </div>
          <div className="relative flex-1">
            <input
              id="comment-input"
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="Write a comment..."
              className="w-full bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-[#ff5500] transition pr-10"
            />
            <button
              onClick={handleComment}
              disabled={loadingComment || !commentText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff5500] disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Link href={`/profile/${comment.user.id}`} className="shrink-0">
                <Avatar
                  src={comment.user.image || ""}
                  alt={comment.user.name || "User"}
                  size={32}
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="text-sm font-semibold text-gray-800 dark:text-white hover:underline"
                  >
                    {comment.user.name || "User"}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center text-gray-500 py-4 text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
      <ReportModal
        trackId={track.id}
        trackTitle={track.title}
        isOpen={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
      />
    </div>
  );
}
