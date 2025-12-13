"use client";

import { Skeleton } from "@/components/ui/skeleton"; // Import từ file trên

export default function UserProfileSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#121212]">
      {/* 1. BANNER SECTION */}
      <div className="relative w-full h-[260px] md:h-[300px] bg-gray-100 dark:bg-[#1f1f1f]">
        {/* Banner Image Placeholder */}
        <Skeleton className="w-full h-full rounded-none" />

        {/* Action Buttons (Edit / Share) - Bottom Right of Banner */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <Skeleton className="h-8 w-20 rounded-sm" /> {/* Edit Button */}
          <Skeleton className="h-8 w-20 rounded-sm" /> {/* Share Button */}
        </div>
      </div>

      {/* CONTAINER CHO PHẦN DƯỚI */}
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
        {/* 2. HEADER INFO SECTION (Avatar + Tabs) */}
        <div className="flex flex-col relative mb-8">
          {/* Avatar - Nằm đè lên Banner một chút */}
          <div className="-mt-16 sm:-mt-24 z-10 mb-4">
            <div className="p-1 bg-white dark:bg-[#121212] w-fit rounded-full sm:rounded-2xl inline-block">
              <Skeleton className="w-32 h-32 sm:w-48 sm:h-48 rounded-full sm:rounded-xl border-4 border-white dark:border-[#121212]" />
            </div>
          </div>

          {/* User Name & Tabs */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-64" /> {/* Tên User */}
            {/* Tabs Navigation (All, Tracks, Playlists...) */}
            <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </div>
        </div>

        {/* 3. MAIN LAYOUT GRID (Left Content + Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* --- LEFT COLUMN: TRACKS & SPOTLIGHT --- */}
          <div className="flex flex-col gap-8">
            {/* Section Title: Spotlight Track */}
            <div className="flex justify-between items-end">
              <Skeleton className="h-5 w-32" /> {/* Text: Spotlight Track */}
              <Skeleton className="h-4 w-16" /> {/* Badge: Featured */}
            </div>

            {/* Track Card Item */}
            <div className="flex gap-4 sm:gap-6">
              {/* Track Image */}
              <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-md" />

              {/* Track Info & Waveform */}
              <div className="flex flex-col flex-1 gap-3 py-1">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 rounded-full" />{" "}
                    {/* Artist Name */}
                    <Skeleton className="h-6 w-48 sm:w-64" />{" "}
                    {/* Track Title */}
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />{" "}
                  {/* Play Button */}
                </div>

                {/* Waveform Fake */}
                <div className="mt-auto space-y-1">
                  <Skeleton className="h-10 w-full rounded-sm opacity-60" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" /> {/* Duration */}
                    <div className="flex gap-3">
                      <Skeleton className="h-3 w-8" /> {/* Like count */}
                      <Skeleton className="h-3 w-8" /> {/* Play count */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List Tracks (Các bài hát phía dưới) */}
            <div className="mt-4 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-16 h-16 shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR STATS --- */}
          <div className="flex flex-col gap-8 pt-2">
            {/* Stats Row (Followers, Following, Tracks) */}
            <div className="flex justify-between text-gray-500 border-b border-gray-100 dark:border-gray-800 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-16" /> {/* Label: Followers */}
                  <Skeleton className="h-6 w-8" /> {/* Number: 0 */}
                </div>
              ))}
            </div>

            {/* Bio Text */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* On The Web (Social Icons) */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" /> {/* Title: On the web */}
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
