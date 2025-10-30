"use client";
import HeroBanner from "@/components/home/HeroBanner";
import HomeHeader from "@/components/home/HomeHeader";
import JoinSection from "@/components/home/JoinSection";
import MainSearch from "@/components/home/MainSearch";
import TrendingSection from "@/components/home/TrendingSection";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function HomePage() {
  const authModal = useAuthModal();
  const handleAuth = () => {
    return authModal.onOpen();
  };
  return (
    <div className="max-w-7xl mx-auto bg-white text-gray-900 mt-8 px-5">
      <div className="relative h-[450px] w-full">
        <HomeHeader handleAuth={handleAuth} />
        <HeroBanner />
      </div>

      {/* Phần nội dung chính bên dưới */}
      <main className="mx-auto max-w-7xl px-4">
        <MainSearch />
        <TrendingSection />
        <JoinSection />
      </main>
    </div>
  );
}
