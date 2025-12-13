"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
// Giả định bạn có thể import type này từ store
import { TrackWithUser } from "@/store/playerStore";

interface WaveformPlayerProps {
  track: TrackWithUser | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  // Giữ nguyên onSeek, nhận tỉ lệ phần trăm (0 đến 1)
  onSeek: (percent: number) => void;
}

// --- CONFIG 3D MODERN ---
const CONFIG = {
  barWidth: 3,
  gap: 2,
  barRadius: 3,
  heightScale: 0.9,

  baselineRatio: 0.65, // Đường chân trời nằm ở 65% chiều cao
  reflectionScale: 0.4,
  reflectionGap: 2,
  minBarHeight: 2,

  hoverScaleRange: 50,
  hoverMaxScale: 1.3,

  colors: {
    primaryStart: "#f97316", // Cam đậm
    primaryEnd: "#fbbf24", // Vàng cam
    base: "#cbd5e1", // Màu xám (chưa nghe)

    reflectionOpacity: 0.35,

    preview: "rgba(251, 146, 60, 0.4)",
    tooltipBg: "rgba(15, 23, 42, 0.9)",
    tooltipText: "#ffffff",
  },
};

// --- UTILITY: FORMAT TIME ---
const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0 || !isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
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

  // Sử dụng Ref để truy cập state mới nhất mà không cần re-render
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [hoverDisplay, setHoverDisplay] = useState<{
    x: number;
    time: string;
  } | null>(null);

  // 1. Xử lý Data: Sử dụng useMemo chỉ tính toán khi track thay đổi
  const effectiveData: number[] = useMemo(() => {
    if (
      track &&
      track.waveform &&
      Array.isArray(track.waveform) &&
      track.waveform.length > 0
    ) {
      // Đảm bảo dữ liệu là số từ 0 đến 1
      return (track.waveform as unknown as number[]).map((v) =>
        Math.min(Math.max(v, 0.05), 1)
      );
    }
    // Dữ liệu giả định (Fake data)
    return Array.from({ length: 120 }, (_, i) => {
      const x = i * 0.1;
      return Math.max(
        (Math.sin(x) * 0.5 + Math.cos(x * 0.5) * 0.5) * 0.7 + 0.2,
        0.05
      );
    });
  }, [track]);

  // 2. Resample Data: Sử dụng useCallback để tạo lại hàm khi dữ liệu thay đổi
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
        // Giới hạn giá trị
        sampled.push(Math.min(Math.max(val, 0.05), 1));
      }
      return sampled;
    },
    [effectiveData]
  );

  // --- HÀM VẼ CHÍNH ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- CẤU HÌNH BAN ĐẦU ---
    const dpr = window.devicePixelRatio || 2;
    const rect = container.getBoundingClientRect();

    // Cập nhật kích thước canvas (Quan trọng cho chất lượng hiển thị)
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
    const maxTopHeight = baseline * CONFIG.heightScale;

    // Lấy giá trị mới nhất từ Ref
    const currentT = currentTimeRef.current;
    const currentDuration = durationRef.current;
    const progressPercent =
      currentDuration > 0 ? currentT / currentDuration : 0;

    // Gradient Chính (Đã nghe)
    const gradMain = ctx.createLinearGradient(
      0,
      baseline - maxTopHeight,
      0,
      baseline
    );
    gradMain.addColorStop(0, CONFIG.colors.primaryEnd);
    gradMain.addColorStop(1, CONFIG.colors.primaryStart);

    // Gradient Bóng (Đã nghe)
    const gradReflect = ctx.createLinearGradient(0, baseline, 0, height);
    gradReflect.addColorStop(0, CONFIG.colors.primaryStart);
    gradReflect.addColorStop(1, `rgba(255, 255, 255, 0)`);

    bars.forEach((amp, i) => {
      const x = i * totalBarWidth;
      const barPercent = (i + 0.5) / barCount; // Tính phần trăm tại trung tâm thanh bar

      // Hover Scale Effect
      let scale = 1;
      if (hoverXRef.current !== null) {
        const dist = Math.abs(x + CONFIG.barWidth / 2 - hoverXRef.current);
        if (dist < CONFIG.hoverScaleRange) {
          const effect = Math.cos(
            (dist / CONFIG.hoverScaleRange) * (Math.PI / 2)
          );
          scale = 1 + (CONFIG.hoverMaxScale - 1) * Math.pow(effect, 2);
        }
      }

      const barHeight = Math.max(
        amp * maxTopHeight * scale,
        CONFIG.minBarHeight
      );
      const reflectHeight = barHeight * CONFIG.reflectionScale;

      // --- Logic Màu Sắc ---
      let mainFill: string | CanvasGradient = CONFIG.colors.base;
      let reflectFill: string | CanvasGradient =
        `rgba(203, 213, 225, ${CONFIG.colors.reflectionOpacity})`;

      const isPlayed = barPercent <= progressPercent;
      let reflectionAlpha = CONFIG.colors.reflectionOpacity;

      if (isPlayed) {
        mainFill = gradMain;

        // Điều chỉnh bóng cho phần đã nghe
        if (hoverDisplay) {
          reflectFill = CONFIG.colors.preview; // Giả định preview là màu sáng hơn
        } else {
          reflectFill = gradReflect;
          reflectionAlpha = 0.5; // Tăng nhẹ độ trong suốt
        }
      }

      // Highlight phần hover trước
      if (!isPlayed && hoverDisplay) {
        const hoverP = hoverDisplay.x / width;
        if (barPercent <= hoverP) {
          mainFill = CONFIG.colors.preview;
          reflectFill = CONFIG.colors.preview;
          reflectionAlpha = CONFIG.colors.reflectionOpacity;
        }
      }

      // --- 1. VẼ PHẦN TRÊN (MAIN WAVE) ---
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = mainFill;
      const yTop = baseline - barHeight;

      // Vẽ thanh sóng chính
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, yTop, CONFIG.barWidth, barHeight, [
          CONFIG.barRadius,
          CONFIG.barRadius,
          0,
          0,
        ]);
      } else {
        ctx.rect(x, yTop, CONFIG.barWidth, barHeight);
      }
      ctx.fill();

      // --- 2. VẼ PHẦN DƯỚI (REFLECTION - BÓNG ĐỔ) ---
      ctx.globalAlpha = reflectionAlpha;
      ctx.fillStyle = reflectFill;

      // Vẽ thanh bóng
      ctx.beginPath();
      const yReflect = baseline + CONFIG.reflectionGap;
      if (ctx.roundRect) {
        ctx.roundRect(x, yReflect, CONFIG.barWidth, reflectHeight, [
          0,
          0,
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
  }, [getResampledData, hoverDisplay]); // Bỏ dependency 'duration' vì dùng durationRef

  // --- LIFECYCLE VÀ ANIMATION LOOP ---
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    // Cleanup: Dừng animation khi component unmount
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  // --- EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    hoverXRef.current = x;

    // Tính toán thời gian cho tooltip
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const hoverTime = percent * durationRef.current;

    setHoverDisplay({ x, time: formatTime(hoverTime) });
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
    // Gọi hàm seek từ component cha
    onSeek(percent);
  };

  // --- RENDER ---
  return (
    <div className="w-full flex flex-col justify-center h-36 select-none group">
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

      <div className="flex justify-between items-center px-1 -mt-8 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
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
