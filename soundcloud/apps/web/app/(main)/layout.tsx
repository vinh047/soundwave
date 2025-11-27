// app/home/layout.tsx
import { GlobalPlayer } from "@/components/player/GlobalPlayer";
import { Navbar } from "./home/_components/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="flex">
        <main className="flex-1 ">{children}</main>
      </div>
      <GlobalPlayer />
    </div>
  );
}
