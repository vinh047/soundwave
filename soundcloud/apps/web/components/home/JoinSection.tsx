import Link from "next/link";
import { Button } from "../ui/Button";

export default function JoinSection({
  handleAuth,
}: {
  handleAuth: () => void;
}) {
  return (
    <section className="bg-white py-16 text-center text-black">
      <div className="mx-auto max-w-xl px-4">
        {/* Tiêu đề chính */}
        <h2 className="mb-3 text-3xl font-semibold tracking-tight">
          Thanks for listening. Now join in.
        </h2>
        {/* Mô tả */}
        <p className="mb-6 text-base text-gray-600">
          Save tracks, follow artists and build playlists. All for free.
        </p>
        {/* Nút chính */}
        <Button dark size="lg" className="mb-4" onClick={handleAuth}>
          Create account
        </Button>
        {/* Liên kết phụ */}
        <p className="text-sm text-gray-500">
          Already have an account? <Button ghost onClick={handleAuth} >Sign in</Button>
        </p>
      </div>
    </section>
  );
}
