"use client";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  url: string;
  height?: number;
  interactive?: boolean;
}

export function Waveform({ url, height = 80, interactive = false }: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#525252",
      progressColor: "#f50",
      cursorColor: "#fff",
      barWidth: 2,
      barRadius: 3,
      height,
      normalize: true,
      interact: interactive,
    });

    wavesurfer.current.load(url);

    return () => wavesurfer.current?.destroy();
  }, [url, height, interactive]);

  return <div ref={waveformRef} className="w-full" />;
}