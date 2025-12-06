"use client";

import { Track } from "@repo/database";
import {
  Heart,
  Repeat,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react";

export default function TrackInteraction({ track }: { track: Track }) {
  const actions = [
    { icon: Heart, label: "45k", color: "hover:text-red-500" },
    { icon: Repeat, label: "12k", color: "hover:text-green-500" },
    { icon: MessageCircle, label: "892", color: "hover:text-blue-500" },
    { icon: Share2, label: "Share", color: "hover:text-white" },
    { icon: MoreVertical, label: "", color: "hover:text-white" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Stats & Title (Mobile view styling) */}

      {/* 2. Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {actions.map((btn, i) => (
          <button
            key={i}
            className={`flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-white/10 ${btn.color}`}
          >
            <btn.icon size={18} />
            {btn.label && <span>{btn.label}</span>}
          </button>
        ))}
      </div>

      {/* 3. About Section */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 border border-gray-200 dark:border-white/5">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-500 uppercase tracking-wider mb-3">
          Description
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
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

      {/* 4. Comments Section (Compact) */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 ">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Comments (892)
        </h3>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-tr from-purple-500 to-pink-500 shrink-0"></div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-pink-500 transition"
            />
          </div>
        </div>

        {/* List Demo */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((_, i) => (
            <div key={i} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700 shrink-0"></div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    User Name
                  </span>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition">
                  This track is amazing! Love the bass.
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
          View all comments
        </button>
      </div>
    </div>
  );
}
