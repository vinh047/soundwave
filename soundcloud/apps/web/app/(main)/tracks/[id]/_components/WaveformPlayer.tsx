"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
// Import type từ store để đồng bộ
import { TrackWithUser } from "@/store/playerStore";

interface WaveformPlayerProps {
  track: TrackWithUser | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (percent: number) => void;
}

const CONFIG = {
  barWidth: 2,
  gap: 1,
  baselineRatio: 0.65,
  reflectionScale: 0.5,
  radius: 2,
  hoverScaleRange: 60,
  hoverMaxScale: 1.3,
  colors: {
    primary: "#22d3ee",
    primaryDark: "#0891b2",
    base: "#334155",
    baseReflection: "rgba(51, 65, 85, 0.3)",
    previewForward: "#67e8f9",
    rewindGhost: "rgba(34, 211, 238, 0.25)",
    hoverHighlight: "#ffffff",
  },
};

export default function WaveformPlayer({
  track,
  currentTime,
  duration,
  isPlaying,
  onSeek,
}: WaveformPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const hoverXRef = useRef<number | null>(null);
  const [hoverDisplay, setHoverDisplay] = useState<{
    x: number;
    time: string;
  } | null>(null);

  // 1. Xử lý dữ liệu sóng (Waveform Data)
  const rawData = useMemo(() => {
    if (!track?.waveform) return null;

    // Ép kiểu an toàn: Prisma Json -> unknown -> number[]
    const data = track.waveform as unknown as number[];

    if (Array.isArray(data) && data.length > 0) return data;
    return null; // Trả về null để kích hoạt logic giả lập bên dưới
  }, [track?.waveform]);

  // Logic fallback nếu không có dữ liệu sóng thật
  const effectiveData = useMemo(() => {
    if (rawData) return rawData;

    // Giả lập sóng
    return Array.from({ length: 100 }, (_, i) => {
      const x = i * 0.1;
      return Math.abs(Math.sin(x) * Math.cos(x * 0.5)) * 0.8 + 0.1;
    });
  }, [rawData]);

  const getResampledData = useCallback(
    (width: number, bars: number) => {
      if (effectiveData.length === 0) return Array(bars).fill(0.05);

      const step = Math.floor(effectiveData.length / bars);
      const sampled = [];
      for (let i = 0; i < bars; i++) {
        const start = i * step;
        let max = 0;
        // Safety check loop
        for (let j = 0; j < step; j++) {
          // check index bounds
          if (start + j < effectiveData.length) {
            const val = effectiveData[start + j];
            if (typeof val === "number") max = Math.max(max, val);
          }
        }
        sampled.push(Math.max(max, 0.05));
      }
      return sampled;
    },
    [effectiveData]
  );

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;

    if (
      canvas.width !== rect.width * dpr ||
      canvas.height !== rect.height * dpr
    ) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    const { width, height } = rect;
    ctx.clearRect(0, 0, width, height);

    // Vẫn vẽ nền tĩnh kể cả khi không có track để UI đẹp
    if (!track && duration === 0) return;

    const totalBarWidth = CONFIG.barWidth + CONFIG.gap;
    const barCount = Math.floor(width / totalBarWidth);
    const bars = getResampledData(width, barCount);

    const baseline = height * CONFIG.baselineRatio;
    const maxTopHeight = baseline;
    const progressPercent = duration > 0 ? currentTime / duration : 0;
    const hoverPercent =
      hoverXRef.current !== null ? hoverXRef.current / width : null;

    // Gradients
    const gradActive = ctx.createLinearGradient(
      0,
      baseline - maxTopHeight,
      0,
      baseline
    );
    gradActive.addColorStop(0, CONFIG.colors.primary);
    gradActive.addColorStop(1, CONFIG.colors.primaryDark);

    const gradBase = ctx.createLinearGradient(
      0,
      baseline - maxTopHeight,
      0,
      baseline
    );
    gradBase.addColorStop(0, "#475569");
    gradBase.addColorStop(1, CONFIG.colors.base);

    const gradReflectActive = ctx.createLinearGradient(0, baseline, 0, height);
    gradReflectActive.addColorStop(0, "rgba(34, 211, 238, 0.4)");
    gradReflectActive.addColorStop(1, "rgba(34, 211, 238, 0.0)");

    bars.forEach((amp, i) => {
      const x = i * totalBarWidth;
      const barPercent = i / barCount;

      let scale = 1;
      let isHoveredDirectly = false;

      if (hoverXRef.current !== null) {
        const dist = Math.abs(x - hoverXRef.current);
        if (dist < CONFIG.hoverScaleRange) {
          const normDist = dist / CONFIG.hoverScaleRange;
          const scaleFactor = Math.pow(Math.cos(normDist * (Math.PI / 2)), 2);
          scale = 1 + (CONFIG.hoverMaxScale - 1) * scaleFactor;
        }
        if (dist < totalBarWidth * 1.5) isHoveredDirectly = true;
      }

      const barHeightTop = amp * maxTopHeight * 0.9 * scale;
      const barHeightReflect = barHeightTop * CONFIG.reflectionScale;

      let topFill: string | CanvasGradient = gradBase;
      let reflectFill: string | CanvasGradient = CONFIG.colors.baseReflection;
      let shadowBlur = 0;

      const isBeforeProgress = barPercent <= progressPercent;

      if (hoverPercent !== null) {
        if (hoverPercent < progressPercent) {
          if (barPercent <= hoverPercent) {
            topFill = gradActive;
            reflectFill = gradReflectActive;
            shadowBlur = 10;
          } else if (barPercent <= progressPercent) {
            topFill = CONFIG.colors.rewindGhost;
            reflectFill = "rgba(34, 211, 238, 0.05)";
          }
        } else {
          if (barPercent <= progressPercent) {
            topFill = gradActive;
            reflectFill = gradReflectActive;
            shadowBlur = 10;
          } else if (barPercent <= hoverPercent) {
            topFill = CONFIG.colors.previewForward;
            reflectFill = "rgba(103, 232, 249, 0.2)";
          }
        }
      } else {
        if (isBeforeProgress) {
          topFill = gradActive;
          reflectFill = gradReflectActive;
          shadowBlur = 10;
        }
      }

      if (isHoveredDirectly) {
        topFill = CONFIG.colors.hoverHighlight;
        reflectFill = "rgba(255, 255, 255, 0.5)";
        shadowBlur = 15;
      }

      // Draw Top
      ctx.beginPath();
      ctx.fillStyle = topFill;
      ctx.shadowColor = CONFIG.colors.primary;
      ctx.shadowBlur = shadowBlur;
      ctx.fillRect(x, baseline - barHeightTop, CONFIG.barWidth, barHeightTop);
      ctx.fill();

      // Draw Reflection
      ctx.shadowBlur = 0;
      ctx.fillStyle = reflectFill;
      ctx.fillRect(x, baseline + 2, CONFIG.barWidth, barHeightReflect);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(draw);
  }, [currentTime, duration, getResampledData, track]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw, isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    hoverXRef.current = x;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setHoverDisplay({ x, time: formatTime(percent * duration) });
  };

  const handleMouseLeave = () => {
    hoverXRef.current = null;
    setHoverDisplay(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.min(Math.max(percent, 0), 1));
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none rounded-xl">
      <div
        ref={containerRef}
        className="relative h-32 w-full cursor-pointer group touch-none overflow-hidden rounded-md bg-gray-100 dark:bg-black"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 border-b border-slate-300 dark:border-slate-700/50 pointer-events-none"
          style={{ top: "65%" }}
        ></div>
        <canvas ref={canvasRef} className="block w-full h-full relative z-10" />

        {hoverDisplay && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-20 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              style={{ left: hoverDisplay.x }}
            />
            <div
              className="absolute top-2 px-2 py-1 bg-slate-200 dark:bg-slate-900/95 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold tracking-wider rounded border border-cyan-500/40 transform -translate-x-1/2 pointer-events-none z-30 backdrop-blur-md"
              style={{ left: hoverDisplay.x }}
            >
              {hoverDisplay.time}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono font-medium text-slate-600 dark:text-slate-500 uppercase tracking-widest px-1">
        <span
          className={
            isPlaying
              ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              : ""
          }
        >
          {formatTime(currentTime)}
        </span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
