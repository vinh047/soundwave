"use client";

import { useLibraryData } from "../hooks/useLibraryData";
import { TrackCard } from "@/components/track/TrackCard";
import { Loader2 } from "lucide-react";

export default function LibraryUploadsPage() {
    const { isLoggedIn, isLoading, uploadedTracks } = useLibraryData();

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
                        Uploads
                    </h2>
                    {uploadedTracks.length > 0 ? (
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {uploadedTracks.map((track) => (
                                <TrackCard key={track.id} track={track} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 border border-dashed rounded">
                            You haven't uploaded any tracks yet.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
