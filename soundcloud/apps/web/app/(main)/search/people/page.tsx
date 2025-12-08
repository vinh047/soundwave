"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import userApi from "@/lib/api/usersApi";
import { SearchPeopleList } from "./_components/SearchPeopleList";

export default function SearchPeoplePage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Browser tự gửi cookie -> Backend lấy được userId -> Trả về isFollowed đúng
        const res = await userApi.searchUsers({ q, limit: 12 });
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  if (!q)
    return (
      <div className="mt-8 text-gray-500">
        Enter a keyword to search people.
      </div>
    );
  if (loading) return <div className="mt-8 text-center">Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <div className="text-gray-500 text-sm mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {data.total} people for "{q}"
      </div>

      {/* Component này bạn đã tạo ở câu trả lời trước */}
      <SearchPeopleList users={data.data} />
    </div>
  );
}
