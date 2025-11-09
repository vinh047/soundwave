"use client";
import HeroBanner from "@/components/home/HeroBanner";
import HomeHeader from "@/components/home/HomeHeader";
import JoinSection from "@/components/home/JoinSection";
import MainSearch from "@/components/home/MainSearch";
import TrendingSection from "@/components/home/TrendingSection";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import { toast } from "sonner";

export default function HomePage() {
  const authModal = useAuthModal();
  const handleAuth = () => {
    return authModal.onOpen();
  };

  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.push("/home");
      }
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);

      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  if (isLoading || isLoggedIn) {
    return <Spinner fullscreen />;
  }
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
