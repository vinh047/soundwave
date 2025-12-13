"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* --- LEFT CONTENT: HERO & RECENT --- */}
        <div className="flex flex-col gap-10">
          {/* 1. Hero Banner ("It all starts with an upload") */}
          <div className="w-full h-[280px] rounded-lg bg-gray-100 dark:bg-[#1f1f1f] relative overflow-hidden">
            <Skeleton className="w-full h-full rounded-lg" />
            {/* Button Placeholder bên trong banner */}
            <div className="absolute bottom-8 left-8 space-y-4">
              <Skeleton className="h-8 w-64 bg-white/20" /> {/* Title text */}
              <Skeleton className="h-10 w-32 rounded-md bg-white/30" />{" "}
              {/* Button */}
            </div>
          </div>

          {/* 2. Section: Welcome Back & Recently Played */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" /> {/* Title: Chào mừng trở lại */}
              <Skeleton className="h-4 w-64" /> {/* Subtitle */}
            </div>

            {/* Horizontal List Cards (Nghe gần đây) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-square w-full rounded-md" />{" "}
                  {/* Cover Image */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-3/4" /> {/* Track Name */}
                    <Skeleton className="h-3 w-1/2" /> {/* Artist Name */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR: TRENDING & TOP TRACKS --- */}
        <div className="flex flex-col gap-8 border-l border-gray-100 dark:border-gray-800 pl-0 lg:pl-6">
          {/* 1. Trending Artists */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-32 uppercase" /> {/* Label */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />{" "}
                  {/* Artist Avatar */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Top Tracks */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-24 uppercase" /> {/* Label */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Skeleton className="w-12 h-12 rounded-sm shrink-0" />{" "}
                  {/* Track Cover */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <Skeleton className="h-3 w-20" /> {/* Artist */}
                    <Skeleton className="h-3.5 w-32" /> {/* Title */}
                    <div className="flex gap-2 mt-1">
                      <Skeleton className="h-2 w-8" /> {/* Play count */}
                      <Skeleton className="h-2 w-8" /> {/* Like count */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
