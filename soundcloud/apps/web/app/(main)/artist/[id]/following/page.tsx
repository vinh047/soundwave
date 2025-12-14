import { Prisma } from "@repo/database";
import FollowUserItem from "@/components/common/FollowUserItem";
import EmptyDisplay from "../../_components/EmptyDisplay";
import userApi from "@/lib/api/usersApi";

type FollowingData = Prisma.FollowGetPayload<{ include: { following: true } }>;

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = id;

  let following: FollowingData[] = [];
  try {
    const res = await userApi.getFollowingByUserId(userId);
    following = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user following:", error);
  }

  if (following.length === 0) {
    return <EmptyDisplay message="This user is not following anyone." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {following.map((follow) => (
        <FollowUserItem
          key={follow.followingId}
          user={follow.following}
          relationType="following"
          followedAt={follow.createdAt} // Pass the follow timestamp
        />
      ))}
    </div>
  );
}
