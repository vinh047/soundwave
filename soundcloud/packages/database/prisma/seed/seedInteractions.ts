import { PrismaClient } from "@prisma/client";

export async function seedInteractions(prisma: PrismaClient) {
  console.log("🎵 Seeding Likes, Reposts, Comments, Follows & Reports...");

  // -----------------------------
  // 1. LIKE
  // -----------------------------
  await prisma.like.createMany({
    data: [
      {
        id: "like_1",
        userId: "user_fan1",
        trackId: "track_A1",
      },
      {
        id: "like_2",
        userId: "user_fan1",
        trackId: "track_A2",
      },
      {
        id: "like_3",
        userId: "user_artist1",
        trackId: "track_A1",
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 2. REPOST
  // -----------------------------
  await prisma.repost.createMany({
    data: [
      {
        id: "repost_1",
        userId: "user_fan1",
        trackId: "track_A1",
      },
      {
        id: "repost_2",
        userId: "user_artist2",
        trackId: "track_A1",
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 3. COMMENT
  // -----------------------------
  await prisma.comment.createMany({
    data: [
      {
        id: "comment_1",
        userId: "user_fan1",
        trackId: "track_A1",
        content: "Amazing track! 🔥🔥",
        timestamp: 45,
      },
      {
        id: "comment_2",
        userId: "user_artist2",
        trackId: "track_A1",
        content: "Love this vibe!",
        timestamp: 120,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 4. FOLLOW
  // -----------------------------
  await prisma.follow.createMany({
    data: [
      {
        followerId: "user_fan1",
        followingId: "user_artist1",
      },
      {
        followerId: "user_fan1",
        followingId: "user_artist2",
      },
      {
        followerId: "user_artist1",
        followingId: "user_artist2",
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 5. REPORT REASONS
  // -----------------------------
  await prisma.reportReason.createMany({
    data: [
      {
        id: "reason_spam",
        reason: "SPAM",
      },
      {
        id: "reason_copyright",
        reason: "COPYRIGHT",
      },
      {
        id: "reason_inappropriate",
        reason: "INAPPROPRIATE_CONTENT",
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 6. REPORTS
  // -----------------------------
  await prisma.report.createMany({
    data: [
      {
        id: "report_1",
        message: "Track uses copyrighted material",
        reporterId: "user_fan1",
        trackId: "track_A1",
        reportReasonId: "reason_copyright",
      },
      {
        id: "report_2",
        message: "Spam or misleading info",
        reporterId: "user_artist2",
        trackId: "track_A2",
        reportReasonId: "reason_spam",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Done seeding interactions!");
}
