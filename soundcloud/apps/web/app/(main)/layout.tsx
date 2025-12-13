// app/home/layout.tsx
import { GlobalPlayer } from "@/components/player/GlobalPlayer";
import { Navbar } from "./home/_components/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-white text-gray-900 dark:bg-[#121212] dark:text-white">
      <Navbar />
      <div className="flex flex-1 pt-10">
        <main className="flex-1 w-full">{children}</main>
      </div>
      <GlobalPlayer />
    </div>
  );
}
