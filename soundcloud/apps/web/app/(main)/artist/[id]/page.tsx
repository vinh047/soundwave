import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart, Repeat, Share2 } from "lucide-react";

// --- IMPORTS API ---
import userApi from "@/lib/api/usersApi";

// --- IMPORTS COMPONENTS ---
// Lưu ý: Đảm bảo đường dẫn import đúng với cấu trúc dự án của bạn
import ArtistSidebar from "../_components/ArtistSidebar";
import ArtistHeader from "../_components/ArtistHeader";
import SpotlightSection from "../_components/SpotlightSection"; // Component chứa WaveformPlayer
import TracksTab from "../_components/tabs/TracksTab";
import PlaylistsTab from "../_components/tabs/PlaylistsTab";
import AlbumsTab from "../_components/tabs/AlbumsTab";
import StaticWaveform from "../_components/utils/StaticWaveform";

export default async function ArtistPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  // 1. FETCH DATA
  const res = await userApi.getUserById(params.id);
  const artist = res.data;

  if (!artist) {
    return notFound();
  }

  // 2. PREPARE DATA
  // - Spotlight: Bài đầu tiên
  // - Recent: Các bài còn lại
  const spotlightTrack =
    artist.tracks && artist.tracks.length > 0 ? artist.tracks[0] : null;
  const recentTracks =
    artist.tracks && artist.tracks.length > 1 ? artist.tracks.slice(1) : [];

  // 3. TAB LOGIC
  const activeTab = searchParams.tab || "all";

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `pb-3 border-b-2 font-medium text-lg transition-colors whitespace-nowrap ${
      isActive
        ? "border-[#ff5500] text-[#ff5500]"
        : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
    }`;
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] dark:bg-[#121212] pb-20">
      {/* HEADER (Avatar vuông & Cover) */}
      <ArtistHeader user={artist} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* TABS NAVIGATION */}
            <div className="border-b border-gray-200 dark:border-white/10 mb-6 sticky top-0 bg-[#f2f2f2] dark:bg-[#121212] z-30 pt-2">
              <nav className="flex gap-6 overflow-x-auto no-scrollbar">
                <Link
                  href={`/artist/${params.id}?tab=all`}
                  className={getTabClass("all")}
                >
                  All
                </Link>
                <Link
                  href={`/artist/${params.id}?tab=tracks`}
                  className={getTabClass("tracks")}
                >
                  Popular Tracks
                </Link>
                <Link
                  href={`/artist/${params.id}?tab=albums`}
                  className={getTabClass("albums")}
                >
                  Albums
                </Link>
                <Link
                  href={`/artist/${params.id}?tab=playlists`}
                  className={getTabClass("playlists")}
                >
                  Playlists
                </Link>
                <Link
                  href={`/artist/${params.id}?tab=reposts`}
                  className={getTabClass("reposts")}
                >
                  Reposts
                </Link>
              </nav>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="min-h-[300px]">
              {/* === TAB: ALL === */}
              {activeTab === "all" && (
                <div className="flex flex-col">
                  {/* A. SPOTLIGHT SECTION (Client Component + Canvas Waveform) */}
                  {spotlightTrack ? (
                    <SpotlightSection
                      track={spotlightTrack}
                      artistName={artist.name || "Artist"}
                    />
                  ) : (
                    // Nếu chưa có bài hát nào
                    <div className="text-center py-10 text-gray-400 text-sm">
                      No tracks uploaded yet.
                    </div>
                  )}

                  {/* B. RECENT TRACKS LIST (Server Render + Static CSS Waveform) */}
                  {recentTracks.length > 0 && (
                    <div className="space-y-4 mt-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Recent
                      </h3>

                      {recentTracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex gap-3 p-2 rounded hover:bg-white dark:hover:bg-[#181818] transition group border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-pointer"
                        >
                          {/* Track Image */}
                          <div className="w-12 h-12 bg-gray-300 shrink-0 relative rounded overflow-hidden">
                            <Image
                              src={
                                track.imagePath || "/images/default-track.png"
                              }
                              alt={track.title}
                              fill
                              className="object-cover"
                            />
                            {/* Hover Play Icon */}
                            <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center">
                              <Play
                                size={16}
                                className="text-white fill-current"
                              />
                            </div>
                          </div>

                          {/* Track Info */}
                          <div className="flex-1 border-b border-gray-200 dark:border-white/10 pb-2 group-hover:border-transparent min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0 pr-2">
                                <p className="text-xs text-gray-500 hover:underline">
                                  {artist.name}
                                </p>
                                <h4 className="text-sm font-normal text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white truncate">
                                  {track.title}
                                </h4>
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                5 days ago
                              </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between h-6">
                              {/* Static Waveform (Nhẹ hơn Canvas) */}
                              <div className="flex-1 max-w-[200px]">
                                <StaticWaveform height="h-6" />
                              </div>

                              {/* Hover Actions */}
                              <div className="flex items-center gap-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200">
                                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                                  <Heart size={12} /> 12K
                                </button>
                                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                                  <Repeat size={12} /> 500
                                </button>
                                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                                  <Share2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Playlist Preview Section in "All" Tab */}
                  {artist.playlists && artist.playlists.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                        Playlists
                      </h3>
                      <PlaylistsTab playlists={artist.playlists.slice(0, 3)} />
                    </div>
                  )}
                </div>
              )}

              {/* === OTHER TABS === */}
              {activeTab === "tracks" && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    All Tracks
                  </h3>
                  <TracksTab tracks={artist.tracks} artistName={artist.name} />
                </section>
              )}

              {activeTab === "albums" && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Albums
                  </h3>
                  <AlbumsTab />
                </section>
              )}

              {activeTab === "playlists" && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Public Playlists
                  </h3>
                  <PlaylistsTab playlists={artist.playlists} />
                </section>
              )}

              {activeTab === "reposts" && (
                <div className="py-10 text-center text-gray-500 italic">
                  This artist hasn&apos;t reposted anything yet.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0 pl-0 lg:pl-4">
            <ArtistSidebar user={artist} />
          </div>
        </div>
      </div>
    </main>
  );
}
