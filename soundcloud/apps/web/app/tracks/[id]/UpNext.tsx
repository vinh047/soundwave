// app/track/[id]/UpNext.tsx
"use client";

import { List } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UpNext() {
  const [autoplay, setAutoplay] = useState(true);

  const queue = [
    {
      id: "1",
      title: "Neon Cruise",
      artist: "@synthwavekid",
      duration: "3:42",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "2",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "12",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "72",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "26",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "25",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "24",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "20",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "21",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
    {
      id: "22",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg"
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 h-[85vh] overflow-auto scrollbar-none">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <List size={20} /> Up Next
      </h3>

      <div className="space-y-3">
        {queue.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
          >
            <span className="text-gray-500 w-5">{i + 1}</span>
            <Image src={item.cover} alt="anh" width={10} height={10} className="w-10 h-10" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-400">{item.artist}</p>
            </div>
            <span className="text-xs text-gray-400">{item.duration}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div>
          <p className="font-medium text-sm">Autoplay</p>
          <p className="text-xs text-gray-400">Play similar tracks</p>
        </div>
        <button
          onClick={() => setAutoplay(!autoplay)}
          className={`w-12 h-7 rounded-full transition ${autoplay ? "bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4]" : "bg-gray-600"} relative`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${autoplay ? "right-1" : "left-1"}`}
          />
        </button>
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10">
        <div className="w-10 h-10 rounded bg-gray-700" />
        <div>
          <p className="font-medium text-sm">Luna Waves Radio</p>
          <p className="text-xs text-gray-400">Based on this track</p>
        </div>
      </div>
    </div>
  );
}
