"use client";

import { useState } from "react";
import {
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronUp,

} from "lucide-react";
import { Prisma } from "@repo/database";
import { getSocialColorHover, getSocialIcon } from "./utils/social";
import Link from "next/link";

type ArtistSidebarUser = Prisma.UserGetPayload<{
  select: {
    id: true;

    _count: {
      select: {
        tracks: true;
        likes: true;
        comments: true;
        following: true;
        followers: true;
      };
    };

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

interface ArtistSidebarProps {
  user: ArtistSidebarUser;
}

export default function ArtistSidebar({ user }: ArtistSidebarProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const stats = {
    followers: user._count?.followers || 0,
    following: user._count?.following || 0,
    tracks: user._count?.tracks || 0,
  };

  const profile = user.profile;

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* 1. Stats Row */}
      <div className="flex justify-between text-gray-600 border-b border-gray-200 dark:border-white/10 pb-5">
        {[
          {
            label: "Followers",
            value: stats.followers,
            link: `/artist/${user.id}/followers`,
          },
          {
            label: "Following",
            value: stats.following,
            link: `/artist/${user.id}/following`,
          },
          {
            label: "Tracks",
            value: stats.tracks,
            link: `/artist/${user.id}/tracks`,
          },
        ].map((item, idx) => (
          <Link key={idx} href={item.link}>
            <div className="text-left cursor-pointer hover:opacity-80 transition group">
              <span className="block text-[11px] uppercase text-gray-400 font-bold tracking-wider group-hover:text-black dark:group-hover:text-white mb-1">
                {item.label}
              </span>
              <span className="text-xl font-light text-black dark:text-white">
                {item.value.toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* 2. Bio Section */}
      {profile?.bio && (
        <div className="relative">
          <div
            className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-wrap transition-all duration-300 ${
              isBioExpanded ? "" : "line-clamp-4"
            }`}
            dangerouslySetInnerHTML={{ __html: profile.bio }}
          />

          {/* Chỉ hiện nút Show more nếu bio dài (đơn giản hóa logic bằng css line-clamp, thực tế có thể check ref scrollHeight) */}
          {profile.bio.length > 150 && (
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-black dark:hover:text-white mt-2 font-medium transition select-none"
            >
              {isBioExpanded ? (
                <>
                  Show less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show more <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* 3. Social Icons Row */}
      {profile?.websiteProfiles && profile.websiteProfiles.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            On the web
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.websiteProfiles.map((web) => (
              <a
                key={web.id}
                href={web.url}
                target="_blank"
                rel="noreferrer"
                className={`
                  w-9 h-9 rounded-full border border-gray-200 dark:border-white/10
                  flex items-center justify-center text-gray-500 dark:text-gray-400
                  transition duration-300 bg-white dark:bg-[#181818]
                  ${getSocialColorHover(web.websiteType?.type)}
                `}
                title={web.websiteType?.type || "Website"}
              >
                {getSocialIcon(web.websiteType?.type)}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 4. Footer Metadata */}
      <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-2 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
          <Heart size={14} />
          <span>{user._count?.likes || 0} Likes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
          <MessageSquare size={14} />
          <span>{user._count?.comments || 0} Comments</span>
        </div>
      </div>

      <div className="text-[10px] text-gray-400 pt-2 leading-tight opacity-60">
        &copy; {new Date().getFullYear()} SoundWave. <br />
        Privacy . Cookies . Imprint . Charts
      </div>
    </div>
  );
}
