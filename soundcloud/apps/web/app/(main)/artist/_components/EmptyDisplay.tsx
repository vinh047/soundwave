import { Frown, LucideIcon } from "lucide-react";
import React from "react";

interface EmptyDisplayProps {
  message: string;

  icon?: LucideIcon | React.ElementType;
}

const DefaultIcon = Frown;

export default function EmptyDisplay({
  message,
  icon: Icon = DefaultIcon,
}: EmptyDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/10">
      {/* Hiển thị Icon */}
      {/* Icon component phải được gọi với kích thước và class */}
      <Icon size={32} className="mb-3 opacity-50" />

      {/* Thông báo */}
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
