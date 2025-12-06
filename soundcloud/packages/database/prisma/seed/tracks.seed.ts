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

    {
      id: "track_VN01",
      title: "Mất Kết Nối",
      description:
        "Hit Vpop 2025 của Dương Domic, giai điệu hiện đại, cảm xúc mạnh mẽ.",
      audioPath: "https://example.com/audio/matketnoi.mp3",
      imagePath: "https://picsum.photos/id/301/300/300",
      duration: 240,
      userId: "user_artist1",
      waveform: [
        0.562, 0.441, 0.899, 0.133, 0.403, 0.778, 0.588, 0.693, 0.228, 0.901,
        0.622, 0.745, 0.319, 0.677, 0.504, 0.172, 0.812, 0.647, 0.559, 0.298,
        0.476, 0.889, 0.234, 0.716, 0.502, 0.319, 0.412, 0.688, 0.874, 0.134,
        0.243, 0.597, 0.845, 0.195, 0.456, 0.623, 0.781, 0.901, 0.544, 0.377,
        0.268, 0.322, 0.905, 0.118, 0.667, 0.558, 0.744, 0.219, 0.479, 0.835,
        0.613, 0.127, 0.383, 0.796, 0.912, 0.665, 0.522, 0.271, 0.317, 0.729,
        0.441, 0.899, 0.133, 0.403, 0.778, 0.588, 0.693, 0.228, 0.901, 0.622,
        0.745, 0.319, 0.677, 0.504, 0.172, 0.812, 0.647, 0.559, 0.298, 0.476,
        0.889, 0.234, 0.716, 0.502, 0.319, 0.412, 0.688, 0.874, 0.134, 0.243,
        0.597, 0.845, 0.195, 0.456, 0.623, 0.781, 0.901, 0.544, 0.377, 0.268,
        0.322, 0.905, 0.118, 0.667, 0.558, 0.744, 0.219, 0.479, 0.835, 0.613,
        0.127, 0.383, 0.796, 0.912, 0.665, 0.522, 0.271, 0.317, 0.729, 0.441,
        0.899, 0.133, 0.403, 0.778, 0.588, 0.693, 0.228, 0.901, 0.622, 0.745,
        0.319, 0.677, 0.504, 0.172, 0.812, 0.647, 0.559, 0.298, 0.476, 0.889,
        0.234, 0.716, 0.502, 0.319, 0.412, 0.688, 0.874, 0.134, 0.243, 0.597,
        0.845, 0.195, 0.456, 0.623, 0.781, 0.901, 0.544, 0.377, 0.268, 0.322,
        0.905, 0.118, 0.667, 0.558, 0.744, 0.219, 0.479, 0.835, 0.613, 0.127,
        0.383, 0.796, 0.912, 0.665, 0.522, 0.271, 0.317, 0.729, 0.441, 0.899,
        0.133, 0.403, 0.778, 0.588, 0.693, 0.228, 0.901, 0.622, 0.745, 0.319,
        0.677, 0.504, 0.172, 0.812, 0.647, 0.559, 0.298, 0.476, 0.889, 0.234,
        0.716, 0.502, 0.319, 0.412, 0.688, 0.874, 0.134, 0.243, 0.597, 0.845,
        0.195, 0.456, 0.623, 0.781, 0.901, 0.544, 0.377, 0.268, 0.322, 0.905,
        0.118, 0.667, 0.558, 0.744, 0.219, 0.479, 0.835, 0.613, 0.127, 0.383,
        0.796, 0.912, 0.665, 0.522, 0.271, 0.317, 0.729, 0.441, 0.899, 0.133,
        0.403, 0.778, 0.588, 0.693, 0.228, 0.901, 0.622, 0.745, 0.319, 0.677,
        0.504, 0.172, 0.812, 0.647, 0.559, 0.298, 0.476, 0.889, 0.234, 0.716,
        0.502, 0.319, 0.412, 0.688, 0.874, 0.134, 0.243, 0.597, 0.845, 0.195,
        0.456, 0.623, 0.781, 0.901, 0.544, 0.377, 0.268, 0.322, 0.905, 0.118,
        0.667, 0.558, 0.744, 0.219, 0.479, 0.835, 0.613, 0.127, 0.383, 0.796,
        0.912, 0.665, 0.522, 0.271, 0.317, 0.729,
      ],
    },

    {
      id: "track_VN02",
      title: "Dancing In The Dark",
      description:
        "Ca khúc của SOOBIN, mang phong cách pop điện tử, đang leo top BXH.",
      audioPath: "https://example.com/audio/dancinginthedark.mp3",
      imagePath: "https://picsum.photos/id/302/300/300",
      duration: 260,
      userId: "user_artist1",
      waveform: [
        0.221, 0.877, 0.732, 0.199, 0.653, 0.774, 0.485, 0.366, 0.941, 0.244,
        0.673, 0.557, 0.339, 0.799, 0.923, 0.188, 0.612, 0.457, 0.781, 0.266,
        0.812, 0.346, 0.501, 0.766, 0.599, 0.422, 0.919, 0.255, 0.833, 0.743,
        0.588, 0.377, 0.266, 0.302, 0.912, 0.647, 0.711, 0.244, 0.889, 0.533,
        0.155, 0.469, 0.824, 0.901, 0.622, 0.322, 0.744, 0.915, 0.588, 0.472,
        0.399, 0.655, 0.904, 0.188, 0.533, 0.711, 0.812, 0.328, 0.741, 0.922,
        0.221, 0.877, 0.732, 0.199, 0.653, 0.774, 0.485, 0.366, 0.941, 0.244,
        0.673, 0.557, 0.339, 0.799, 0.923, 0.188, 0.612, 0.457, 0.781, 0.266,
        0.812, 0.346, 0.501, 0.766, 0.599, 0.422, 0.919, 0.255, 0.833, 0.743,
        0.588, 0.377, 0.266, 0.302, 0.912, 0.647, 0.711, 0.244, 0.889, 0.533,
        0.155, 0.469, 0.824, 0.901, 0.622, 0.322, 0.744, 0.915, 0.588, 0.472,
        0.399, 0.655, 0.904, 0.188, 0.533, 0.711, 0.812, 0.328, 0.741, 0.922,
        0.221, 0.877, 0.732, 0.199, 0.653, 0.774, 0.485, 0.366, 0.941, 0.244,
        0.673, 0.557, 0.339, 0.799, 0.923, 0.188, 0.612, 0.457, 0.781, 0.266,
        0.812, 0.346, 0.501, 0.766, 0.599, 0.422, 0.919, 0.255, 0.833, 0.743,
        0.588, 0.377, 0.266, 0.302, 0.912, 0.647, 0.711, 0.244, 0.889, 0.533,
        0.155, 0.469, 0.824, 0.901, 0.622, 0.322, 0.744, 0.915, 0.588, 0.472,
        0.399, 0.655, 0.904, 0.188, 0.533, 0.711, 0.812, 0.328, 0.741, 0.922,
        0.221, 0.877, 0.732, 0.199, 0.653, 0.774, 0.485, 0.366, 0.941, 0.244,
        0.673, 0.557, 0.339, 0.799, 0.923, 0.188, 0.612, 0.457, 0.781, 0.266,
        0.812, 0.346, 0.501, 0.766, 0.599, 0.422, 0.919, 0.255, 0.833, 0.743,
        0.588, 0.377, 0.266, 0.302, 0.912, 0.647, 0.711, 0.244, 0.889, 0.533,
        0.155, 0.469, 0.824, 0.901, 0.622, 0.322, 0.744, 0.915, 0.588, 0.472,
        0.399, 0.655,
      ],
    },

    {
      id: "track_VN03",
      title: "Bắc Bling",
      description:
        "Hiện tượng âm nhạc lớn nhất năm 2025, phong cách trẻ trung, sôi động.",
      audioPath: "https://example.com/audio/bacbling.mp3",
      imagePath: "https://picsum.photos/id/303/300/300",
      duration: 230,
      userId: "user_artist1",
      waveform: [
        0.344, 0.899, 0.744, 0.211, 0.455, 0.699, 0.882, 0.533, 0.355, 0.277,
        0.812, 0.944, 0.588, 0.402, 0.265, 0.721, 0.619, 0.788, 0.199, 0.345,
        0.941, 0.588, 0.499, 0.312, 0.822, 0.733, 0.255, 0.944, 0.622, 0.511,
        0.478, 0.699, 0.321, 0.855, 0.944, 0.411, 0.577, 0.266, 0.388, 0.844,
        0.955, 0.632, 0.422, 0.311, 0.866, 0.577, 0.211, 0.745, 0.945, 0.612,
        0.344, 0.899, 0.744, 0.211, 0.455, 0.699, 0.882, 0.533, 0.355, 0.277,
        0.812, 0.944, 0.588, 0.402, 0.265, 0.721, 0.619, 0.788, 0.199, 0.345,
        0.941, 0.588, 0.499, 0.312, 0.822, 0.733, 0.255, 0.944, 0.622, 0.511,
        0.478, 0.699, 0.321, 0.855, 0.944, 0.411, 0.577, 0.266, 0.388, 0.844,
        0.955, 0.632, 0.422, 0.311, 0.866, 0.577, 0.211, 0.745, 0.945, 0.612,
      ],
    },

    {
      id: "track_VN04",
      title: "Em Xinh",
      description:
        "Ca khúc pop ballad ngọt ngào, gây sốt trên các nền tảng nghe nhạc.",
      audioPath: "https://example.com/audio/emxinh.mp3",
      imagePath: "https://picsum.photos/id/304/300/300",
      duration: 250,
      userId: "user_artist1",
      waveform: [
        0.221, 0.377, 0.655, 0.744, 0.522, 0.266, 0.399, 0.855, 0.933, 0.588,
        0.411, 0.277, 0.622, 0.744, 0.912, 0.355, 0.455, 0.788, 0.233, 0.533,
        0.655, 0.744, 0.522, 0.266, 0.399, 0.855, 0.933, 0.588, 0.411, 0.277,
        0.622, 0.744, 0.912, 0.355, 0.455, 0.788, 0.233, 0.533,
      ],
    },

    {
      id: "track_VN05",
      title: "Anh Trai",
      description:
        "Bản rap kết hợp cùng giai điệu bắt tai, được giới trẻ yêu thích.",
      audioPath: "https://example.com/audio/anhtrai.mp3",
      imagePath: "https://picsum.photos/id/305/300/300",
      duration: 270,
      userId: "user_artist1",
      waveform: [
        0.611, 0.455, 0.288, 0.744, 0.812, 0.344, 0.199, 0.522, 0.688, 0.933,
        0.411, 0.312, 0.722, 0.588, 0.477, 0.266, 0.599, 0.844, 0.911, 0.566,
        0.211, 0.455, 0.288, 0.744, 0.812, 0.344, 0.199, 0.522, 0.688, 0.933,
        0.411, 0.312, 0.722, 0.588, 0.477, 0.266, 0.599, 0.844, 0.911, 0.566,
      ],
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
