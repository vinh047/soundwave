"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import userApi from "@/lib/api/usersApi";
import { SearchPeopleList } from "./_components/SearchPeopleList";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer"; // 👇 Import thư viện

export default function SearchPeoplePage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  // State tách rời để dễ quản lý nối mảng
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Hook theo dõi đáy trang
  const { ref, inView } = useInView();
  const LIMIT = 12; // Số lượng user mỗi lần tải

  // 1. Khi từ khóa thay đổi -> Reset và tải trang 1
  useEffect(() => {
    if (!q) return;

    const fetchFirstPage = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      setUsers([]); // Clear list cũ

      try {
        const res = await userApi.searchUsers({ 
          q, 
          limit: LIMIT,
          page: 1 
        });
        
        // Giả định cấu trúc trả về giống Track/Playlist: res.data.data là mảng
        const items = res.data?.data || [];
        const totalCount = res.data?.total || 0;

        setUsers(items);
        setTotal(totalCount);

        if (items.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [q]);

  // 2. Load More khi cuộn xuống đáy
  useEffect(() => {
    if (inView && hasMore && !loading && q) {
      loadMore();
    }
  }, [inView, hasMore, loading, q]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await userApi.searchUsers({ 
        q: q!, 
        limit: LIMIT, 
        page: nextPage 
      });
      
      const newItems = res.data?.data || [];

      if (newItems.length > 0) {
        // 👇 Nối mảng user cũ + mới
        setUsers((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      }

      if (newItems.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi tải thêm user:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---

  if (!q) {
    return (
      <div className="mt-10 text-center text-gray-500 italic">
        Enter a keyword to search for people.
      </div>
    );
  }

  return (
    <div>
      {/* Header kết quả */}
      <div className="text-gray-500 text-sm mb-6 pb-3 border-b border-gray-100 dark:border-gray-800 font-medium">
        Found {total} people for &quot;<span className="text-gray-900 dark:text-white">{q}</span>&quot;
      </div>

      {/* Danh sách Users */}
      <SearchPeopleList users={users} />

      {/* 👇 Phần Loading & Sentinel */}
      <div className="py-8 flex justify-center w-full">
        {loading && <Loader2 className="animate-spin text-orange-500 w-6 h-6" />}
        
        {/* Div tàng hình để trigger loadMore */}
        {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}

        {!hasMore && users.length > 0 && (
           <p className="text-xs text-gray-400 mt-4">End of results.</p>
        )}

        {!loading && users.length === 0 && (
            <p className="text-sm text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}