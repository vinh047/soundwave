import * as Dialog from "@radix-ui/react-dialog";
import { X, Home, Search, Upload, Library, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const { user, isLoggedIn } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    ...(isLoggedIn
      ? [
        { icon: Upload, label: "Upload", href: "/tracks/upload" },
        { icon: Library, label: "Your Library", href: "/library" },
        { icon: User, label: "Profile", href: `/artist/${user?.id}` },
      ]
      : [
        { icon: LogIn, label: "Login", href: "/login" },
        { icon: User, label: "Register", href: "/register" },
      ]),
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className="fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-gray-800 z-50 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <Dialog.Close className="p-1">
              <X className="h-6 w-6" />
            </Dialog.Close>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white transition"
                onClick={() => onOpenChange(false)}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-lg">{item.label}</span>
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}