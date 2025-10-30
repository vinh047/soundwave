import { Button } from "../ui/Button";

export default function TrendingSection() {
  return (
    <section className="py-12 text-center">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Hear what&apos;s trending for free in the SoundCloud community
      </h2>
      <Button dark size="lg">
        Explore trending playlists
      </Button>
    </section>
  );
}
