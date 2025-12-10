"use client";

import { Button } from "@/components/ui2/Button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function TryArtistPro() {
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#121212] dark:text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] flex-col items-center justify-center bg-[#111] px-4 text-center text-white">
        {/* Placeholder for background image */}
        <div className="absolute inset-0 z-0 bg-[url('/images/artist-pro-hero-bg.jpg')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Reach more listeners.
          </h1>
          <div className="mb-10 flex items-center justify-center gap-2 text-lg md:text-xl">
            {/* Placeholder for artist avatars if needed, or just text */}
            <p>Join millions of artists that use SoundCloud to get heard.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/checkout/artist">
              <Button
                size="lg"
                className="h-12 rounded-full bg-white px-8 text-base font-bold text-black hover:bg-gray-200"
              >
                Get Artist Pro
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToPlans}
              className="h-12 rounded-full border-white px-8 text-base font-bold text-white hover:bg-white/10 hover:text-white"
            >
              See all plans
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" ref={plansRef} className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
            {/* Artist Plan */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">Artist</h3>
                  <div className="rounded-full bg-purple-500 p-1 text-white">
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Tailored access to essential artist tools
                </p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-purple-600">₫40,000</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">billed yearly for ₫480,000</p>
              </div>
              <Link href="/checkout/artist" className="w-full">
                <Button className="mb-8 w-full rounded-full bg-black py-6 text-base font-bold text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Get started
                </Button>
              </Link>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5"><CloudUploadIcon /></span>
                  <span>3 hours of uploads</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><BoltIcon /></span>
                    <span>Boost tracks and get 100+ listeners</span>
                  </div>
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">2X MONTH</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><DollarSignIcon /></span>
                    <span>Distribute & monetize tracks</span>
                  </div>
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">2X MONTH</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><RefreshCwIcon /></span>
                    <span>Replace tracks without losing stats</span>
                  </div>
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">3X MONTH</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><SlidersIcon /></span>
                    <span>AI Mastering</span>
                  </div>
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">1X MONTH</span>
                </li>
              </ul>
            </div>

            {/* Artist Pro Plan */}
            <div className="relative flex flex-col rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-lg dark:bg-zinc-900">
              <div className="absolute -top-4 right-8 bg-[#C5A059] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider rounded-sm">
                Most Popular
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">Artist Pro</h3>
                  <div className="rounded-full bg-orange-500 p-1 text-white">
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Unlimited access to all artist tools
                </p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#C5A059]">₫95,000</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">billed yearly for ₫1,140,000</p>
              </div>
              <Link href="/checkout/artist" className="w-full">
                <Button className="mb-8 w-full rounded-full bg-black py-6 text-base font-bold text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Get started
                </Button>
              </Link>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5"><CloudUploadIcon /></span>
                  <span>Unlimited uploads</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><BoltIcon /></span>
                    <span>Boost tracks and get 100+ listeners</span>
                  </div>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold px-1.5 py-0.5 rounded">UNLIMITED</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><DollarSignIcon /></span>
                    <span>Distribute & monetize tracks</span>
                  </div>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold px-1.5 py-0.5 rounded">UNLIMITED</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><RefreshCwIcon /></span>
                    <span>Replace tracks without losing stats</span>
                  </div>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold px-1.5 py-0.5 rounded">UNLIMITED</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5"><SlidersIcon /></span>
                    <span>AI Mastering</span>
                  </div>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold px-1.5 py-0.5 rounded">3X MONTH</span>
                </li>
              </ul>
              <div className="mt-6 border-t border-gray-100 pt-6 dark:border-zinc-800">
                <p className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">And more</p>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5"><LineChartIcon /></span>
                    <span>Audience stats and insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5"><MessageSquareIcon /></span>
                    <span>Community management tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="bg-gray-50 py-20 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold">Compare features.</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800">
                  <th className="pb-8 pl-4 text-xl font-bold w-1/3"></th>
                  <th className="pb-8 text-center w-1/5">
                    <div className="text-2xl font-bold">Basic</div>
                    <div className="text-gray-500 font-normal">Free</div>
                    <div className="mt-2 text-sm text-gray-400">Current plan</div>
                  </th>
                  <th className="pb-8 text-center w-1/5">
                    <div className="text-2xl font-bold">Artist</div>
                    <div className="text-gray-500 font-normal">₫40,000 <span className="text-xs">/mo</span></div>
                    <Button size="sm" className="mt-4 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">Get started</Button>
                  </th>
                  <th className="pb-8 text-center w-1/5">
                    <div className="text-2xl font-bold text-green-600">Artist Pro</div>
                    <div className="text-green-600 font-normal">₫95,000 <span className="text-xs">/mo</span></div>
                    <Button size="sm" className="mt-4 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">Get started</Button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {/* Get heard */}
                <SectionHeader title="Get heard" />
                <TableRow
                  title="Promote tracks"
                  desc="Our algorithm analyzes and recommends your tracks to 100 or even 1000 listeners most likely to love it."
                  basic="-"
                  artist="2 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Get playlisted"
                  desc="Subscribers that opt in can get featured on playlists like Buzzing followed by future fans, A&Rs, and more"
                  basic="-"
                  artist="2 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Distribute and get paid"
                  desc="Earn royalties from 60+ social and streaming platforms like Spotify and TikTok"
                  basic="-"
                  artist="2 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Advanced audience stats"
                  desc="See how listeners found your music, your top fans, and where they're located"
                  basic="-"
                  artist="How fans found you"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Comments hub"
                  desc="Effectively track and answer messages and comments"
                  basic="-"
                  artist="-"
                  pro={<CheckCircleIcon />}
                />

                {/* Manage your music */}
                <SectionHeader title="Manage your music" />
                <TableRow title="Upload limit" basic="2 hours" artist="3 hours" pro="Unlimited" proColor="text-green-600 font-bold" />
                <TableRow title="Free mastering credits" basic="-" artist="1 track / month" pro="3 tracks / month" proColor="text-green-600 font-bold" />
                <TableRow
                  title="Replace tracks"
                  desc="Swap out your track files without losing plays, likes or comments."
                  basic="-"
                  artist="3 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Quiet mode"
                  desc="Hide or turn off comments for tracks, and choose if you want to have plays and likes displayed."
                  basic="-"
                  artist="-"
                  pro={<CheckCircleIcon />}
                />
                <TableRow title="Schedule track releases" basic="-" artist="-" pro={<CheckCircleIcon />} />

                {/* Build your brand */}
                <SectionHeader title="Build your brand" />
                <TableRow
                  title="Profile badge"
                  desc="Visible to fans and collaborators."
                  basic="-"
                  artist={<Badge text="ARTIST" color="bg-orange-500" />}
                  pro={<Badge text="ARTIST PRO" color="bg-orange-500" />}
                />
                <TableRow
                  title="Spotlight"
                  desc="Have control over your first impression by spotlighting your best tracks at the top of your profile."
                  basic="-"
                  artist="1 track"
                  pro="5 tracks"
                  proColor="text-green-600 font-bold"
                />

                {/* Get paid */}
                <SectionHeader title="Get paid" />
                <TableRow
                  title="Monetize on SoundCloud"
                  desc="Get paid for streams on SoundCloud with fan-powered royalties, and keep 100% of your earnings."
                  basic="-"
                  artist="2 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="Distribute and monetize on 60+ other platforms"
                  desc="Get paid regularly for streams on Spotify, Apple Music, TikTok and more, and keep 100% of your earnings."
                  basic="-"
                  artist="2 tracks / month"
                  pro="Unlimited"
                  proColor="text-green-600 font-bold"
                />
                <TableRow
                  title="YouTube Content ID"
                  desc="Get paid when your music is used in YouTube videos"
                  basic="-"
                  artist={<CheckCircleGrayIcon />}
                  pro={<CheckCircleIcon />}
                />
                <TableRow
                  title="Split royalties"
                  desc="Make sure your collaborators get paid"
                  basic="-"
                  artist="-"
                  pro={<CheckCircleIcon />}
                />

                {/* Special treatment */}
                <SectionHeader title="Special treatment" />
                <TableRow title="Priority support" basic="-" artist="-" pro={<CheckCircleIcon />} />
                <TableRow title="Get 50% off Go+" basic="-" artist="-" pro={<CheckCircleIcon />} />
                <TableRow
                  title="Exclusive Partner Savings"
                  desc="Exclusive offers & discounts from partners like Groover, Serato, and Tracklib."
                  basic="-"
                  artist="Partial access"
                  pro="Full access"
                  proColor="text-green-600 font-bold"
                />

              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <tr>
      <td colSpan={4} className="pt-12 pb-6 text-xl font-bold">{title}</td>
    </tr>
  )
}

function TableRow({ title, desc, basic, artist, pro, proColor }: { title: string, desc?: string, basic: React.ReactNode, artist: React.ReactNode, pro: React.ReactNode, proColor?: string }) {
  return (
    <tr className="group hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors">
      <td className="py-6 pl-4 pr-8 align-top">
        <div className="font-bold text-base">{title}</div>
        {desc && <div className="mt-1 text-sm text-gray-500 font-normal">{desc}</div>}
      </td>
      <td className="py-6 text-center align-middle text-gray-500">{basic}</td>
      <td className="py-6 text-center align-middle font-medium">{artist}</td>
      <td className={`py-6 text-center align-middle ${proColor || 'font-medium'}`}>{pro}</td>
    </tr>
  )
}

// Icons
function CloudUploadIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg> }
function BoltIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><circle cx="12" cy="12" r="4" /></svg> } // Using a generic icon for now
function DollarSignIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> }
function RefreshCwIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg> }
function SlidersIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" /></svg> }
function LineChartIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg> }
function MessageSquareIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> }
function CheckCircleIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#16a34a" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg> }
function CheckCircleGrayIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#6b7280" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg> }

function Badge({ text, color }: { text: string, color: string }) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${color} px-2 py-0.5 text-[10px] font-bold text-white`}>
      <Star size={10} fill="currentColor" />
      {text}
    </div>
  )
}
