"use client";

import { useLibraryData } from "../hooks/useLibraryData";
import { LibraryTabs } from "../_components/LibraryTabs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LibraryFollowingPage() {
  const { isLoggedIn, isLoading, following } = useLibraryData();

  if (isLoading)
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  if (!isLoggedIn) return null;

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mt-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold border-b border-gray-800 pb-2">
            Following
          </h2>
          {following.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {following.map((followedUser) => (
                <Link
                  href={`/artist/${followedUser.id}`}
                  key={followedUser.id}
                  className="flex flex-col items-center group"
                >
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-orange-500 transition-all shadow-lg relative">
                    {followedUser.image ? (
                      <Image
                        src={followedUser.image}
                        alt={followedUser.name || "User"}
                        width={160}
                        height={160}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full bg-orange-500 flex items-center justify-center text-white text-5xl">
                        {followedUser.name?.[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold group-hover:text-orange-500 transition-colors">
                    {followedUser.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed rounded">
              You are not following anyone yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
