"use client";

import { Prisma } from "@repo/database";
import { TrackCard } from "./TrackCard";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
interface TrackListProps {
  tracks: Prisma.TrackGetPayload<{ include: { user: true } }>[];
}

export function TrackList({ tracks }: TrackListProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [WheelGesturesPlugin()]
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevBtnEnabled(api.canScrollPrev());
    setNextBtnEnabled(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!tracks.length) return null;

  return (
    <div className="relative group">
      {/* Viewport của Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Container chứa các slides - Dùng flex thay vì grid */}
        <div className="flex gap-4 sm:gap-6 touch-pan-y">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0"
            >
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Nút điều hướng (Chỉ hiện khi hover vào group trên PC) --- */}

      {/* Nút Previous */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
          flex h-10 w-10 items-center justify-center rounded-full 
          bg-white shadow-lg border border-gray-100 text-gray-700
          transition-all duration-200
          hover:scale-110 hover:bg-orange-500 hover:text-white hover:border-orange-500
          disabled:opacity-0 disabled:cursor-default
          opacity-0 group-hover:opacity-100 
          dark:bg-zinc-800 dark:border-zinc-700 dark:text-white
          ${!prevBtnEnabled && "hidden"} 
        `}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Nút Next */}
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
          flex h-10 w-10 items-center justify-center rounded-full 
          bg-white shadow-lg border border-gray-100 text-gray-700
          transition-all duration-200
          hover:scale-110 hover:bg-orange-500 hover:text-white hover:border-orange-500
          disabled:opacity-0 disabled:cursor-default
          opacity-0 group-hover:opacity-100
          dark:bg-zinc-800 dark:border-zinc-700 dark:text-white
           ${!nextBtnEnabled && "hidden"}
        `}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
