"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller } from "swiper/modules";
import Image from "next/image";
import { Button } from "../ui/Button";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

type Slide = {
  image: string;
  title: string[];
  description: string;
  button1: { text: string; variant: "light" | "dark" };
  button2?: { text: string; variant: "light" | "dark" }; // optional
};

const slides: Slide[] = [
  {
    image: "/images/istockphoto-2161509311-612x612.jpg",
    title: ["Discover.", "Get Discovered."],
    description:
      "Discover your next obsession, or become someone else's.\nSoundCloud is the only community where fans and artists come\ntogether to discover and connect through music.",
    button1: { text: "Get Started", variant: "light" as const },
  },
  {
    image: "/images/istockphoto-161839324-612x612.jpg",
    title: ["It all starts with", "an upload."],
    description:
      "From bedrooms and broom closets to studios and stadiums,\nSoundCloud is where you define what's next in music. Just hit upload.",
    button1: { text: "Upload", variant: "light" as const },
    // button2: { text: "Explore Artist Pro", variant: "dark" as const },
  },
  {
    image: "/images/istockphoto-472328791-612x612.jpg",
    title: ["Where every", "music scene lives."],
    description:
      "Discover 400 million songs, remixes and DJ sets: every chart-topping track...",
    button1: { text: "Upload", variant: "light" as const },
    // button2: { text: "Explore Go+", variant: "dark" as const },
  },
];

export default function HeroSliderWithImage({
  handleAuth,
}: {
  handleAuth: () => void;
}) {
  // State để lưu instance của Swiper
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(
    null
  );
  // State để theo dõi slide đang hoạt động
  const [activeIndex, setActiveIndex] = useState(0);

  // Hàm xử lý khi click vào thanh điều khiển
  const handleControlClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index); // Dùng slideToLoop vì có loop={true}
    }
  };

  return (
    <section className="relative h-[450px] w-full ">
      <Swiper
        // Lưu instance của Swiper vào state khi nó sẵn sàng
        onSwiper={setSwiperInstance}
        // Cập nhật activeIndex khi slide thay đổi
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // Dùng realIndex vì có loop={true}
        // Kích hoạt các module
        modules={[Autoplay, Controller]} // Chỉ cần Autoplay và Controller
        // Cấu hình
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="myHeroSwiper h-full w-full rounded-2xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
                className="select-none"
              />

              {/* 2. Lớp phủ mờ */}
              <div className="absolute inset-0 z-10 bg-black/30" />

              {/* 3. Nội dung text */}
              <div className="absolute inset-0 z-20 flex h-full items-center px-10 pt-16">
                <div className="max-w-2xl">
                  {/* Tiêu đề */}
                  <h1 className="mb-4 text-5xl font-bold leading-tight text-white">
                    {slide.title.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  {/* Mô tả */}
                  <p className="mb-6 whitespace-pre-line text-lg leading-normal text-white">
                    {slide.description}
                  </p>
                  {/* Các nút bấm */}
                  <div className="flex gap-4">
                    {slide.button1 && (
                      <Button
                        {...{ [slide.button1.variant]: true }}
                        onClick={handleAuth}
                      >
                        {slide.button1.text}
                      </Button>
                    )}
                    {slide.button2 && (
                      <Button {...{ [slide.button2.variant]: true }}>
                        {slide.button2.text}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 3 Thanh ngang điều khiển tùy chỉnh */}
      <div className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleControlClick(index)}
            className={`h-1 w-8 cursor-pointer rounded-full transition-colors duration-300 ${
              activeIndex === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
