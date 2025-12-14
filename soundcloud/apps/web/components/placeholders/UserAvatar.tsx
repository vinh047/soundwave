// components/placeholders/UserAvatar.tsx
import { User } from "lucide-react";

export function UserAvatarPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800">
      <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-300" />
    </div>
  );
}
