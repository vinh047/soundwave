import { Disc } from "lucide-react";

export default function AlbumsTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       <div className="aspect-square bg-gray-100 dark:bg-[#181818] rounded flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
          <Disc size={40} className="mb-2 opacity-50"/>
          <span className="text-sm">No Albums yet</span>
       </div>
    </div>
  );
}