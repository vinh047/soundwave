import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";

const MOCK_TRENDING = [1, 2, 3, 4, 5, 6];

export default function TrendingSection() {
  return (
    <section className="bg-white dark:bg-[#121212] py-20 px-4 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Hear what’s trending for free
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get curated playlists and charts directly from the community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {MOCK_TRENDING.map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 mb-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
                <Image
                  src={`https://picsum.photos/seed/${item}/300/300`}
                  alt="Album Art"
                  fill
                  className="object-cover group-hover:opacity-80 transition-opacity"
                />
              </div>

              <h3 className="font-medium truncate text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                Top Hit {item}
              </h3>

              <p className="text-sm truncate text-gray-500 dark:text-gray-400">
                Various Artists
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href={"/home"}>
            <Button
              outline
              size="lg"
              className="rounded-full border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:border-white dark:hover:bg-white/10 transition-colors"
            >
              Explore trending playlists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
