import { Globe, Users, Music } from "lucide-react";

// Định nghĩa props dựa trên query include
interface ArtistSidebarProps {
  stats: {
    followers: number;
    following: number;
    tracks: number;
  };
  profile: any; // Type user.profile bao gồm websiteProfiles
}

// Map icon string từ DB ra icon component (Thủ công hoặc dùng thư viện dynamic)
const getSocialIcon = (iconName: string | null) => {
    // Logic đơn giản, bạn có thể mở rộng
    return <Globe size={16} />;
};

export default function ArtistSidebar({ stats, profile }: ArtistSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Stats Box */}
      <div className="flex flex-wrap gap-6 md:block md:space-y-4 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Users size={16} />
            </div>
            <div>
                <p className="text-xs uppercase font-bold tracking-wider">Followers</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.followers}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Users size={16} />
            </div>
             <div>
                <p className="text-xs uppercase font-bold tracking-wider">Following</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.following.toLocaleString()}</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Music size={16} />
            </div>
             <div>
                <p className="text-xs uppercase font-bold tracking-wider">Tracks</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.tracks.toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-white/10" />

      {/* Bio */}
      {profile?.bio && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">BIO</h3>
          <div 
            className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{ __html: profile.bio }} // Nếu bio là rich text
          />
        </div>
      )}

      {/* Social Links */}
      {profile?.websiteProfiles?.length > 0 && (
        <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">ON THE WEB</h3>
            <div className="flex flex-col gap-2">
                {profile.websiteProfiles.map((web: any) => (
                    <a 
                        key={web.id} 
                        href={web.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#ff5500] hover:underline transition"
                    >
                        {getSocialIcon(web.websiteType.icon)}
                        {web.websiteType.type}
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}