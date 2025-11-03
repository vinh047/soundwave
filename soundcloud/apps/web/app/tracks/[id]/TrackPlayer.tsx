"use client";

import { useState, useRef, useEffect } from "react";
import { Prisma } from "@repo/database";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  MessageCircle,
  Share2,
  Plus,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";

type Track = Prisma.TrackGetPayload<{ include: { user: true } }> & {
  waveform?: number[];
  playCount: number;
};

export default function TrackPlayer({ track }: { track: Track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<number[]>(
    track.waveform && track.waveform.length
      ? track.waveform
      : Array.from({ length: 400 }, () => Math.random() * 0.9 + 0.1)
  );

  // --- LOGIC WAVEFORM TĨNH (GIỮ NGUYÊN) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Đồng bộ kích thước canvas thật
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    // Dữ liệu waveform
    const waveform =
      track.waveform && track.waveform.length
        ? track.waveform
        : waveformRef.current;

    const step = width / waveform.length;
    const progress = duration > 0 ? currentTime / duration : 0;

    for (let i = 0; i < waveform.length; i++) {
      const amp = waveform[i] ?? 0;
      const barHeight = amp * height * 0.9;
      const x = i * step;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = i / waveform.length < progress ? "#4ecdc4" : "#444";
      ctx.fillRect(x, y, step * 0.8, barHeight);
    }
  }, [track.waveform, currentTime, duration]);

  // --- PLAYER CONTROLS LOGIC (GIỮ NGUYÊN) ---
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(percent * duration);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- GIAO DIỆN HIỂN THỊ (KẾT HỢP) ---
  return (
    <div className="flex flex-col gap-6 h-[88vh] overflow-auto scrollbar-none">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div
          className="relative h-36 bg-black/30 rounded-xl overflow-hidden cursor-pointer"
          onClick={handleSeek}
        >
          <canvas ref={canvasRef} className="w-full" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          320kbps • **Static Waveform**
        </p>
      </div>

      {/* 2. Player Controls (Giữ nguyên) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause size={28} fill="black" color="black" />
            ) : (
              <Play size={28} fill="black" color="black" className="ml-1" />
            )}
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
          <span className="ml-4 flex items-center gap-1">
            <Play size={14} /> {track.playCount.toLocaleString()} plays
          </span>
        </div>
      </div>

      {/* 3. Action Buttons (Thêm vào) */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: Heart, label: "45,821" },
          { icon: Repeat, label: "12,453" },
          { icon: MessageCircle, label: "892" },
          { icon: Share2, label: "Share" },
          { icon: Plus, label: "" },
          { icon: MoreVertical, label: "" },
        ].map((btn, i) => (
          <button
            key={i}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition cursor-pointer"
          >
            <btn.icon size={16} />
            {btn.label && <span>{btn.label}</span>}
          </button>
        ))}
      </div>

      {/* 4. Thống kê tổng quan (Thêm vào) */}
      <p className="text-center text-xs text-gray-400">
        45,821 likes • 12,453 reposts • 892 comments • Posted 2 days ago
      </p>

      {/* 5. About Section (Thêm vào) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-3">About this track</h3>
        <p className="text-gray-300 leading-relaxed">
          A mesmerizing journey through ambient soundscapes and pulsing beats.
          Created during late night studio sessions...
        </p>
        <div className="flex gap-2 flex-wrap mt-4">
          {["#Electronic", "#electronic", "#ambient"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">Comments</h3>

        {/* --- Ô nhập comment --- */}
        <div className="flex items-start gap-3 mb-6">
          <Image
            src={track.imagePath || "/images/default-cover.jpg"}
            alt={"abcxyz"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]"
            />
          </div>
          <button className="bg-[#4ecdc4] text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition">
            Post
          </button>
        </div>

        {/* --- Danh sách comment --- */}
        <div className="space-y-5">
          {[
            {
              name: "Linh Nguyen",
              avatar: "/avatars/user2.jpg",
              time: "2h ago",
              text: "Love this vibe! It feels so chill 🌊",
            },
            {
              name: "Khoa Music",
              avatar: "/avatars/user3.jpg",
              time: "5h ago",
              text: "The drop at 1:20 is insane 🔥🔥🔥",
            },
            {
              name: "Mira Beats",
              avatar: "/avatars/user4.jpg",
              time: "1d ago",
              text: "Reminds me of early Odesza. Great work!",
            },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <Image
                src={track.imagePath || "/images/default-cover.jpg"}
                alt={c.name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{c.text}</p>
                <div className="flex gap-4 text-xs text-gray-400 mt-2">
                  <button className="hover:text-[#4ecdc4] transition">
                    Like
                  </button>
                  <button className="hover:text-[#4ecdc4] transition">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.audioPath || "/SoundHelix-Song-1.mp3"}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
