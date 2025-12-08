import { SearchPeopleCard } from "./SearchPeopleCard";

interface SearchPeopleListProps {
  users: any[]; // Thay any bằng UserData[] nếu có thể
}

export function SearchPeopleList({ users }: SearchPeopleListProps) {
  if (!users || users.length === 0) {
    return <div className="text-gray-500 italic mt-4">No people found matching your search.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
      {/* Layout Grid 2 cột trên desktop sẽ đẹp hơn cho danh sách user ngắn */}
      {users.map((user) => (
        <SearchPeopleCard key={user.id} user={user} />
      ))}
    </div>
  );
}