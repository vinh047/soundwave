import { Prisma } from "@repo/database";
import EmptyDisplay from "../../_components/EmptyDisplay";
import userApi from "@/lib/api/usersApi";
import LikeTrackItem from "../../_components/LikeTrackItem";

type LikeData = Prisma.LikeGetPayload<{
  include: {
    track: {
      include: {
        user: true;
        likes: true;
        reposts: true;
        comments: { include: { user: true } };
        _count: {
          select: { likes: true; reposts: true; comments: true };
        };
      };
    };
  };
}>[];

export default async function LikesPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;

  let likedItems: LikeData = [];

  try {
    const res = await userApi.getLikesByUserId(userId);
    likedItems = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch liked tracks", error);
  }

  if (!likedItems.length) {
    return <EmptyDisplay message="No liked tracks yet" />;
  }

  return (
    <div className="space-y-4">
      {likedItems.map((item) => (
        <LikeTrackItem key={item.id} like={item} />
      ))}
    </div>
  );
}
