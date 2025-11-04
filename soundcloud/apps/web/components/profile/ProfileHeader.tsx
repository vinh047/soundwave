import { Avatar } from "../ui2/Avatar";
import Image from "next/image";

interface ProfileHeaderProps {
  user: any;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative h-64 bg-linear-to-b from-orange-600 to-gray-900">
      <div className="absolute inset-0 bg-black/30" />
      <Image
        src="/profile-banner.jpg"
        alt=""
        fill
        className="object-cover opacity-50"
      />
      <div className="absolute bottom-0 left-8 transform translate-y-1/2">
        <Avatar src={user.avatarUrl} alt={user.username} size={120} />
      </div>
    </div>
  );
}