"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Prisma } from "@repo/database";

interface WaveformPlayerProps {
  track: Prisma.TrackGetPayload<{ include: { user: true } }>;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (percent: number) => void;
}

const CONFIG = {
  // --- CẤU HÌNH CƠ BẢN ---
  barWidth: 2,
  gap: 1,

  baselineRatio: 0.65,
  reflectionScale: 0.5,
  radius: 2,

  // --- CẤU HÌNH HIỆU ỨNG MAGNIFY (LÀM MỀM HƠN) ---
  hoverScaleRange: 60, // Phạm vi ảnh hưởng rộng hơn để độ dốc thoai thoải
  hoverMaxScale: 1.3, // Độ phóng đại vừa phải

  colors: {
    // Màu chủ đạo (Cyan Neon)
    primary: "#22d3ee", // Cyan-400
    primaryDark: "#0891b2", // Cyan-600

    // Màu nền (Slate)
    base: "#334155",
    baseReflection: "rgba(51, 65, 85, 0.3)",

    // --- MÀU TRẠNG THÁI TUA (QUAN TRỌNG) ---
    previewForward: "#67e8f9", // Sáng hơn khi tua tới
    rewindGhost: "rgba(34, 211, 238, 0.25)", // Mờ hẳn đi khi tua lui (Ghost)
    hoverHighlight: "#ffffff", // Trắng tinh tại điểm chuột
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

  // 1. Dữ liệu giả lập
  const rawData = useMemo(() => {
    const data = track.waveform as unknown as number[] | null | undefined;
    if (Array.isArray(data) && data.length > 0) return data;

    // Giả lập sóng
    return Array.from({ length: 400 }, (_, i) => {
      const x = i * 0.1;
      const val = Math.sin(x) * Math.cos(x * 0.5) * Math.sin(x * 0.2);
      return Math.abs(val) * 0.8 + Math.random() * 0.2;
    });
  }, [track.waveform]);

  // SỬA LỖI 2: Dùng useCallback để hàm này không bị tạo mới mỗi lần render
  const getResampledData = useCallback(
    (width: number, bars: number) => {
      const step = Math.floor(rawData.length / bars);
      const sampled = [];
      for (let i = 0; i < bars; i++) {
        const start = i * step;
        let max = 0;
        for (let j = 0; j < step; j++) {
          // SỬA LỖI 1: TypeScript safety check
          const val = rawData[start + j];
          if (val !== undefined) {
            max = Math.max(max, val);
          }
        }
        sampled.push(Math.max(max, 0.05));
      }
      return sampled;
    },
    [rawData]
  );

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // 2. RENDER LOOP
  // SỬA LỖI 2: Bọc toàn bộ hàm draw trong useCallback và liệt kê đủ dependencies
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

    const totalBarWidth = CONFIG.barWidth + CONFIG.gap;
    const barCount = Math.floor(width / totalBarWidth);
    const bars = getResampledData(width, barCount);

    const baseline = height * CONFIG.baselineRatio;
    const maxTopHeight = baseline;

    const progressPercent = duration > 0 ? currentTime / duration : 0;
    const hoverPercent =
      hoverXRef.current !== null ? hoverXRef.current / width : null;

    // --- SETUP GRADIENTS ---
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

      // --- A. XỬ LÝ MAGNIFY (Làm mượt scale) ---
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

      // --- B. LOGIC MÀU SẮC ---
      let topFill: string | CanvasGradient = gradBase;
      let reflectFill: string | CanvasGradient = CONFIG.colors.baseReflection;
      let shadowBlur = 0;

      const isBeforeProgress = barPercent <= progressPercent;

      if (hoverPercent !== null) {
        // ==> ĐANG HOVER <==

        if (hoverPercent < progressPercent) {
          // 1. TUA LUI (REWINDING)
          if (barPercent <= hoverPercent) {
            topFill = gradActive;
            reflectFill = gradReflectActive;
            shadowBlur = 10;
          } else if (barPercent <= progressPercent) {
            topFill = CONFIG.colors.rewindGhost;
            reflectFill = "rgba(34, 211, 238, 0.05)";
          }
        } else {
          // 2. TUA TỚI (SEEKING FORWARD)
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
        // ==> KHÔNG HOVER <==
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

      // --- VẼ ---
      ctx.beginPath();
      ctx.fillStyle = topFill;
      ctx.shadowColor = CONFIG.colors.primary;
      ctx.shadowBlur = shadowBlur;

      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(
          x,
          baseline - barHeightTop,
          CONFIG.barWidth,
          barHeightTop,
          [CONFIG.radius, CONFIG.radius, 0, 0]
        );
      } else {
        ctx.fillRect(x, baseline - barHeightTop, CONFIG.barWidth, barHeightTop);
      }
      ctx.fill();

      // Vẽ phản chiếu
      ctx.shadowBlur = 0;
      ctx.fillStyle = reflectFill;
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, baseline + 2, CONFIG.barWidth, barHeightReflect, [
          0,
          0,
          CONFIG.radius,
          CONFIG.radius,
        ]);
      } else {
        ctx.fillRect(x, baseline + 2, CONFIG.barWidth, barHeightReflect);
      }
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(draw);
  }, [currentTime, duration, getResampledData]);
  // Kết thúc useCallback cho draw, bao gồm đủ deps

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw, isPlaying]); // Đã thêm 'draw' vào deps, ESLint sẽ hết báo lỗi

  // Event Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.min(Math.max(percent, 0), 1));
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none rounded-xl ">
      <div
        ref={containerRef}
        className="relative h-32 w-full cursor-pointer group touch-none overflow-hidden rounded-md bg-gray-100 dark:bg-black"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Lớp lưới nền techy */}
        <div
          className="absolute inset-0 border-b border-slate-300 dark:border-slate-700/50 pointer-events-none"
          style={{ top: "65%" }}
        ></div>

        <canvas ref={canvasRef} className="block w-full h-full relative z-10" />

        {/* Hover UI */}
        {hoverDisplay && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-20 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              style={{ left: hoverDisplay.x }}
            />
            <div
              className="absolute top-2 px-2 py-1 bg-slate-200 dark:bg-slate-900/95 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold tracking-wider rounded border border-cyan-500/40 transform -translate-x-1/2 pointer-events-none z-30 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
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
