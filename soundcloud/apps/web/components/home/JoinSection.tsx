import { Button } from "../ui/Button";

export default function JoinSection({
  handleAuth,
}: {
  handleAuth: () => void;
}) {
  return (
    <section className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-24 text-center border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
          Calling all creators
        </h2>

        <p className="mb-10 text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
          Get on SoundWave to connect with fans, share your sounds, and grow
          your audience. What are you waiting for?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-orange-600! hover:bg-orange-700! text-white! border-none! rounded-full w-full sm:w-auto font-bold"
            onClick={handleAuth}
          >
            Find out more
          </Button>

          <span className="text-gray-500 font-medium">or</span>

          <Button
            light
            size="lg"
            className="rounded-full w-full sm:w-auto font-bold"
            onClick={handleAuth}
          >
            Create account
          </Button>
        </div>
      </div>
    </section>
  );
}
