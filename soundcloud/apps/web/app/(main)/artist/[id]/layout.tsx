import { notFound } from "next/navigation";
import userApi from "@/lib/api/usersApi";
import ArtistHeader from "../_components/ArtistHeader";
import ArtistSidebar from "../_components/ArtistSidebar";
import { ArtistNavTabs } from "../_components/ArtistNavTabs";

export default async function ArtistLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await userApi.getArtistProfileData(id);
  const artist = res.data;

  if (!artist) return notFound();

  return (
    <main className="min-h-screen bg-[#f2f2f2] dark:bg-[#121212] pb-24">
      {/* HEADER */}
      <ArtistHeader user={artist} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* NAV */}
            <ArtistNavTabs artistId={id} />

            {/* MAIN CONTENT */}
            <div className="animate-in fade-in duration-300">{children}</div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0">
            <ArtistSidebar user={artist} />
          </div>
        </div>
      </div>
    </main>
  );
}
