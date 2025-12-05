import { Button } from "../ui/Button";

export default function HomeHeader({ handleAuth }: { handleAuth: () => void }) {
  return (
    <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-6">
      <nav className="flex items-center gap-4 ">
        <Button light onClick={handleAuth}>
          Sign in
        </Button>
        <Button dark onClick={handleAuth}>
          Create account
        </Button>
      </nav>
    </header>
  );
}
