"use client";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function MainSearch() {
  return (
    <section className="flex w-full items-center justify-center gap-4 border-b border-gray-100 py-8 mt-6">
      {/* Form tìm kiếm */}
      <form className="relative flex w-1/2 max-w-lg">
        <Input
          size="sm"
          placeholder="Search for artists, bands, tracks, podcasts"
          fullWidth
          rightAddon={<IoSearchOutline size={20} />}
        />

      </form>

      <span className="text-gray-500">or</span>

      {/* Nút Upload */}
      <Button dark >
        Upload your own
      </Button>
    </section>
  );
}
