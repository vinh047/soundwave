"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuth } from "./contexts/AuthContext";
import Spinner from "@/components/common/Spinner";
import { toast } from "sonner";

import HomeHeader from "@/components/home/HomeHeader";
import LandingHero from "@/components/home/LandingHero";
import TrendingSection from "@/components/home/TrendingSection";
import JoinSection from "@/components/home/JoinSection";

export default function HomePage() {
  const authModal = useAuthModal();
  const handleAuth = () => {
    return authModal.onOpen();
  };

  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/home");
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
    <div className="min-h-screen w-full bg-white dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header & Hero */}
      <HomeHeader handleAuth={handleAuth} />
      <LandingHero />

      {/* Main Content */}
      <main>
        <TrendingSection />
        <JoinSection handleAuth={handleAuth} />
      </main>

      <footer className="py-8 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <p>&copy; 2024 SoundWave. All rights reserved.</p>
      </footer>
    </div>
  );
}
