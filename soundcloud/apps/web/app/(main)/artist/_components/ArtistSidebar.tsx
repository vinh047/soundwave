import {
  Music,
  Globe,
  Heart,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Prisma } from "@repo/database";

interface ArtistSidebarProps {
  user: Prisma.UserGetPayload<{
    include: {
      tracks: true;
      playlists: true;
      likes: true;
      reposts: true;
      reports: true;
      comments: true;
      following: true;
      followers: true;
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

// Helper: Map icon từ database sang Lucide React Component
// Dựa vào trường 'type' trong bảng WebsiteType (ví dụ: "FACEBOOK", "YOUTUBE")
const getSocialIcon = (typeCode: string = "") => {
  const code = typeCode.toUpperCase();
  const iconProps = { size: 16 };

  switch (code) {
    case "FACEBOOK":
      return <Facebook {...iconProps} />;
    case "INSTAGRAM":
      return <Instagram {...iconProps} />;
    case "YOUTUBE":
      return <Youtube {...iconProps} />;
    case "TWITTER":
    case "X":
      return <Twitter {...iconProps} />;
    case "TIKTOK":
      return <Music {...iconProps} />; // Icon thay thế cho Tiktok nếu chưa có
    default:
      return <Globe {...iconProps} />;
  }
};

// Helper: Map màu hover cho từng loại mạng xã hội
const getSocialColorHover = (typeCode: string = "") => {
  const code = typeCode.toUpperCase();
  switch (code) {
    case "FACEBOOK":
      return "hover:bg-[#1877F2]";
    case "INSTAGRAM":
      return "hover:bg-[#E4405F]";
    case "YOUTUBE":
      return "hover:bg-[#FF0000]";
    case "TWITTER":
    case "X":
    case "TIKTOK":
      return "hover:bg-black";
    default:
      return "hover:bg-gray-600";
  }
};

export default function ArtistSidebar({ user }: ArtistSidebarProps) {
  // Tính toán số liệu thống kê từ độ dài mảng (vì query findOne của bạn include các mảng này)
  const stats = {
    followers: user.followers?.length || 0,
    following: user.following?.length || 0,
    tracks: user.tracks?.length || 0,
  };

  const profile = user.profile;

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* 1. Stats Row */}
      <div className="flex justify-between text-gray-600 border-b border-gray-200 dark:border-white/10 pb-4">
        <div className="text-left cursor-pointer hover:opacity-80 transition group">
          <span className="block text-xs uppercase text-gray-400 font-medium group-hover:text-black dark:group-hover:text-white">
            Followers
          </span>
          <span className="text-xl font-light text-black dark:text-white">
            {stats.followers.toLocaleString()}
          </span>
        </div>
        <div className="text-left cursor-pointer hover:opacity-80 transition group">
          <span className="block text-xs uppercase text-gray-400 font-medium group-hover:text-black dark:group-hover:text-white">
            Following
          </span>
          <span className="text-xl font-light text-black dark:text-white">
            {stats.following.toLocaleString()}
          </span>
        </div>
        <div className="text-left cursor-pointer hover:opacity-80 transition group">
          <span className="block text-xs uppercase text-gray-400 font-medium group-hover:text-black dark:group-hover:text-white">
            Tracks
          </span>
          <span className="text-xl font-light text-black dark:text-white">
            {stats.tracks.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. Bio Section */}
      {profile?.bio && (
        <div className="relative">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">
            Bio
          </h3>
          <div
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 font-normal"
            dangerouslySetInnerHTML={{ __html: profile.bio }}
          />
          {/* Nút show more giả lập, logic thực tế sẽ cần state */}
          <button className="text-xs text-gray-500 hover:text-black dark:hover:text-white mt-1 font-medium transition">
            Show more
          </button>
        </div>
      )}

      {/* 3. Social Icons Row */}
      {profile?.websiteProfiles && profile.websiteProfiles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">
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
                  w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 
                  flex items-center justify-center text-gray-500 dark:text-gray-400
                  transition duration-300 hover:text-white
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
      <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-2 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Heart size={12} />
          <span>Likes {user.likes?.length || 0} tracks</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MessageSquare size={12} />
          <span>{user.comments?.length || 0} Comments</span>
        </div>
      </div>

      <div className="text-[10px] text-gray-400 pt-4 leading-tight">
        Legal - Privacy - Cookies - Imprint - Creator Resources - Blog - Charts{" "}
        <br />
        Language: English (US)
      </div>
    </div>
  );
}
