"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
// Đảm bảo đường dẫn import đúng
import { TrackWithUser } from "@/store/playerStore";

interface WaveformPlayerProps {
  track: TrackWithUser | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (percent: number) => void;
}

// --- CONFIG 3D MODERN ---
const CONFIG = {
  barWidth: 3,
  gap: 2,
  barRadius: 3, // Bo góc
  heightScale: 0.9, // Chiều cao sóng chính

  // CẤU HÌNH 3D REFLECTION (BÓNG ĐỔ)
  baselineRatio: 0.65, // Đường chân trời nằm ở 65% chiều cao
  reflectionScale: 0.4, // Bóng dài bằng 40% sóng thật
  reflectionGap: 2, // Khoảng cách giữa sóng và bóng
  minBarHeight: 2, // Chiều cao tối thiểu

  hoverScaleRange: 50,
  hoverMaxScale: 1.3,

  colors: {
    primaryStart: "#f97316", // Cam đậm
    primaryEnd: "#fbbf24", // Vàng cam
    base: "#cbd5e1", // Màu xám (chưa nghe)

    reflectionOpacity: 0.35, // Độ mờ của bóng

    preview: "rgba(251, 146, 60, 0.4)",
    tooltipBg: "rgba(15, 23, 42, 0.9)",
    tooltipText: "#ffffff",
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

  const currentTimeRef = useRef(currentTime);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [hoverDisplay, setHoverDisplay] = useState<{
    x: number;
    time: string;
  } | null>(null);

  // 1. Xử lý Data
  const effectiveData: number[] = useMemo(() => {
    if (
      track &&
      track.waveform &&
      Array.isArray(track.waveform) &&
      track.waveform.length > 0
    ) {
      return track.waveform as unknown as number[];
    }
    // Fake data
    return Array.from({ length: 120 }, (_, i) => {
      const x = i * 0.1;
      return (Math.sin(x) * 0.5 + Math.cos(x * 0.5) * 0.5) * 0.7 + 0.2;
    });
  }, [track]);

  // 2. Resample Data
  const getResampledData = useCallback(
    (width: number, bars: number) => {
      if (!effectiveData || effectiveData.length === 0)
        return Array(bars).fill(0.05);

      const step = effectiveData.length / bars;
      const sampled = [];

      for (let i = 0; i < bars; i++) {
        let sum = 0;
        let count = 0;
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);

        for (let j = start; j < end && j < effectiveData.length; j++) {
          sum += effectiveData[j] ?? 0;
          count++;
        }

        const val = count > 0 ? sum / count : effectiveData[start] || 0.05;
        sampled.push(Math.max(val, 0.05));
      }
      return sampled;
    },
    [effectiveData]
  );

  // --- HÀM VẼ 3D REFLECTION ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const rect = container.getBoundingClientRect();

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

    // Xác định đường chân trời (Baseline)
    const baseline = height * CONFIG.baselineRatio;
    // Chiều cao tối đa cho phần sóng trên
    const maxTopHeight = baseline * 0.9;

    const currentT = currentTimeRef.current;
    const progressPercent = duration > 0 ? currentT / duration : 0;

    // Gradient Chính (Phần trên)
    const gradMain = ctx.createLinearGradient(
      0,
      baseline - maxTopHeight,
      0,
      baseline
    );
    gradMain.addColorStop(0, CONFIG.colors.primaryEnd);
    gradMain.addColorStop(1, CONFIG.colors.primaryStart);

    // Gradient Bóng (Phần dưới - mờ dần)
    const gradReflect = ctx.createLinearGradient(0, baseline, 0, height);
    gradReflect.addColorStop(0, CONFIG.colors.primaryStart);
    gradReflect.addColorStop(1, "rgba(255,255,255,0)");

    bars.forEach((amp, i) => {
      const x = i * totalBarWidth;
      const barPercent = i / barCount;

      // Hover Scale Effect
      let scale = 1;
      if (hoverXRef.current !== null) {
        const dist = Math.abs(x - hoverXRef.current);
        if (dist < CONFIG.hoverScaleRange) {
          const effect = Math.cos(
            (dist / CONFIG.hoverScaleRange) * (Math.PI / 2)
          );
          scale = 1 + (CONFIG.hoverMaxScale - 1) * Math.pow(effect, 2);
        }
      }

      // Chiều cao sóng chính
      const barHeight = Math.max(
        amp * maxTopHeight * CONFIG.heightScale * scale,
        CONFIG.minBarHeight
      );

      // Chiều cao bóng phản chiếu (Ngắn hơn)
      const reflectHeight = barHeight * CONFIG.reflectionScale;

      // Logic Màu Sắc
      let mainFill: string | CanvasGradient = CONFIG.colors.base;
      let reflectFill: string | CanvasGradient =
        `rgba(203, 213, 225, ${CONFIG.colors.reflectionOpacity})`;

      const isPlayed = barPercent <= progressPercent;

      if (hoverDisplay) {
        const hoverP = hoverDisplay.x / width;
        if (barPercent <= progressPercent) {
          mainFill = gradMain;
          reflectFill = gradReflect;
        } else if (barPercent <= hoverP) {
          mainFill = CONFIG.colors.preview;
          reflectFill = CONFIG.colors.preview;
        }
      } else {
        if (isPlayed) {
          mainFill = gradMain;
          // Hack nhỏ để lấy màu gradient cho bóng nhưng vẫn giữ độ mờ
          reflectFill = gradReflect;
        }
      }

      // --- 1. VẼ PHẦN TRÊN (MAIN WAVE) ---
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = mainFill;
      ctx.beginPath();
      // Vẽ từ baseline đi lên
      const yTop = baseline - barHeight;
      if (ctx.roundRect) {
        // Bo góc trên
        ctx.roundRect(x, yTop, CONFIG.barWidth, barHeight, [
          CONFIG.barRadius,
          CONFIG.barRadius,
          2,
          2,
        ]);
      } else {
        ctx.rect(x, yTop, CONFIG.barWidth, barHeight);
      }
      ctx.fill();

      // --- 2. VẼ PHẦN DƯỚI (REFLECTION - BÓNG ĐỔ) ---
      // Giảm opacity cho bóng
      ctx.globalAlpha =
        isPlayed && !hoverDisplay ? 0.5 : CONFIG.colors.reflectionOpacity;
      ctx.fillStyle = reflectFill;

      ctx.beginPath();
      // Vẽ từ baseline + gap đi xuống
      const yReflect = baseline + CONFIG.reflectionGap;
      if (ctx.roundRect) {
        // Bo góc dưới
        ctx.roundRect(x, yReflect, CONFIG.barWidth, reflectHeight, [
          2,
          2,
          CONFIG.barRadius,
          CONFIG.barRadius,
        ]);
      } else {
        ctx.rect(x, yReflect, CONFIG.barWidth, reflectHeight);
      }
      ctx.fill();
    });

    // Reset alpha
    ctx.globalAlpha = 1.0;

    animationRef.current = requestAnimationFrame(draw);
  }, [getResampledData, hoverDisplay, duration]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  // --- EVENT HANDLERS ---
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    hoverXRef.current = x;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    setHoverDisplay({ x, time: formatTime(percent * duration) });
  };

  const handleMouseLeave = () => {
    hoverXRef.current = null;
    setHoverDisplay(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    onSeek(percent);
  };

  return (
    <div className="w-full flex flex-col justify-center h-48 select-none group">
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-pointer touch-none"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Tooltip */}
        {hoverDisplay && (
          <div
            className="absolute pointer-events-none z-20 flex flex-col items-center"
            style={{
              left: hoverDisplay.x,
              top: "40%",
              transform: "translate(-50%, 0)",
            }}
          >
            <div
              className="px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md shadow-xl border border-white/10"
              style={{
                backgroundColor: CONFIG.colors.tooltipBg,
                color: CONFIG.colors.tooltipText,
              }}
            >
              {hoverDisplay.time}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-1 -mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
        <span
          className={`text-[10px] font-medium font-mono ${isPlaying ? "text-orange-500" : "text-slate-400"}`}
        >
          {formatTime(currentTime)}
        </span>
        <span className="text-[10px] font-medium text-slate-400 font-mono">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
