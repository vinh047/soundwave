import { PrismaClient } from "@prisma/client";

export async function seedTracks(prisma: PrismaClient) {
  console.log("🎵 Seeding 10 test tracks with real HTTPS paths...");

  const tracksData = [
    {
      id: "track_A1",
      title: "Ambient Test 1",
      description: "Nhạc điện tử thử nghiệm nhẹ nhàng.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      imagePath: "https://picsum.photos/id/1018/300/300",
      duration: 280,
      userId: "user_artist1",
    },
    {
      id: "track_A2",
      title: "Lo-Fi Chill",
      description: "Nhạc Lo-Fi thư giãn, phù hợp học tập.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      imagePath: "https://picsum.photos/id/1025/300/300",
      duration: 295,
      userId: "user_artist1",
    },
    {
      id: "track_A3",
      title: "Epic Score",
      description: "Nhạc nền hoành tráng, mang tính điện ảnh.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      imagePath: "https://picsum.photos/id/10/300/300",
      duration: 310,
      userId: "user_artist2",
    },
    {
      id: "track_A4",
      title: "Smooth Jazz",
      description: "Một bản nhạc Jazz êm dịu.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      imagePath: "https://picsum.photos/id/1084/300/300",
      duration: 265,
      userId: "user_artist1",
    },
    {
      id: "track_A5",
      title: "Pop Demo Beat",
      description: "Nhạc Pop demo với nhịp điệu nhanh.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      imagePath: "https://picsum.photos/id/119/300/300",
      duration: 245,
      userId: "user_artist2",
    },
    {
      id: "track_A6",
      title: "Techno Groove",
      description: "Bản nhạc Techno năng lượng cao.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      imagePath: "https://picsum.photos/id/145/300/300",
      duration: 300,
      userId: "user_artist1",
    },
    {
      id: "track_A7",
      title: "Piano Solo",
      description: "Bản nhạc Piano buồn và sâu lắng.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      imagePath: "https://picsum.photos/id/161/300/300",
      duration: 220,
      userId: "user_artist1",
    },
    {
      id: "track_A8",
      title: "Retro Synth",
      description: "Nhạc Synthwave gợi nhớ thập niên 80.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      imagePath: "https://picsum.photos/id/175/300/300",
      duration: 270,
      userId: "user_artist1",
    },
    {
      id: "track_A9",
      title: "Electro House",
      description: "Nhạc House với bassline mạnh mẽ.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      imagePath: "https://picsum.photos/id/191/300/300",
      duration: 340,
      userId: "user_artist2",
    },
    {
      id: "track_A10",
      title: "Cinematic Rise",
      description: "Nhạc kịch tính, tăng cường cảm xúc.",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
      imagePath: "https://picsum.photos/id/201/300/300",
      duration: 285,
      userId: "user_artist1",
    },
  ];

  await prisma.track.createMany({
    data: tracksData,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded ${tracksData.length} tracks successfully with HTTPS paths.`
  );
}
