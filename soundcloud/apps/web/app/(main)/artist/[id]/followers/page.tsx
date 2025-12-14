import { Prisma } from "@repo/database";
import FollowUserItem from "@/components/common/FollowUserItem";

import userApi from "@/lib/api/usersApi"; // hoặc gọi prisma trực tiếp
import EmptyDisplay from "../../_components/EmptyDisplay";

type FollowerData = Prisma.FollowGetPayload<{
  include: { follower: true };
}>;

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = id;

  // Fetch theo server — KHÔNG dùng SWR trong server component
  const res = await userApi.getFollowersByUserId(userId);
  const followers: FollowerData[] = res.data.data ?? [];

  if (followers.length === 0) {
    return <EmptyDisplay message="This user has no followers yet." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {followers.map((follow) => (
        <FollowUserItem
          key={follow.followerId}
          user={follow.follower}
          relationType="follower"
          followedAt={follow.createdAt} // Pass the follow timestamp
        />
      ))}
    </div>
  );
}
