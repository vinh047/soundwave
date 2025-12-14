"use client";

import * as Popover from "@radix-ui/react-popover";
import {
  Share2,
  Link as LinkIcon,
  Facebook,
  X,
  Instagram,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
  shareUrl: string; // URL cần chia sẻ (ví dụ: link đến trang Artist)
  shareTitle: string; // Tiêu đề (ví dụ: Tên nghệ sĩ)
  trigger?: React.ReactNode; // Nút bấm tùy chỉnh để mở modal
}

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: <Facebook size={18} className="text-blue-600" />,
    url: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    color: "hover:bg-blue-50/50",
  },
  {
    name: "Twitter/X",
    icon: <X size={18} className="text-black dark:text-white" />,
    url: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    color: "hover:bg-gray-100 dark:hover:bg-gray-700",
  },
  {
    name: "Instagram",
    icon: <Instagram size={18} className="text-pink-600" />,
    url: (url: string, title: string) => "https://www.instagram.com/",
    color: "hover:bg-pink-50/50",
  },
];

const ShareModal: React.FC<ShareModalProps> = ({ shareUrl, shareTitle, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link đã được sao chép!");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Không thể sao chép link.");
    }
  };

  const handleSocialShare = (socialUrl: string) => {
    window.open(socialUrl, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        {trigger || (
          <button
            className="flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-2 bg-transparent border border-gray-400 hover:border-white text-white hover:bg-white/10 rounded-[3px] text-sm font-medium transition"
            aria-label="Share profile"
          >
            <Share2 size={18} />
            <span className="hidden md:inline ml-2">Share</span>
          </button>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 bg-white dark:bg-[#181818] rounded-lg shadow-xl p-2 border border-gray-200 dark:border-white/10 w-52 md:w-64 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          align="end"
          sideOffset={10}
        >
          <p className="text-sm font-bold p-2 text-gray-800 dark:text-white">
            Share Link
          </p>

          <div className="space-y-1">
            {/* Social Share Buttons */}
            {SOCIAL_LINKS.map((social) => (
              <button
                key={social.name}
                onClick={() =>
                  handleSocialShare(social.url(shareUrl, shareTitle))
                }
                className={`w-full flex items-center gap-3 p-2 rounded-md transition ${social.color}`}
              >
                {social.icon}
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {social.name}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />

            {/* Copy Link Button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 p-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <LinkIcon
                size={18}
                className="text-gray-600 dark:text-gray-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Copy Link
              </span>
            </button>
          </div>

          <Popover.Arrow className="fill-white dark:fill-[#181818]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ShareModal;
