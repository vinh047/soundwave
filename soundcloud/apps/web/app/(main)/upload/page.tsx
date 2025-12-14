// app/upload/page.tsx (hoặc components/UploadPage.tsx)
"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  Music,
  Loader2,
  Download,
  AudioWaveform,
} from "lucide-react"; // Thêm Download icon
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui2/Button";
import { Input } from "@/components/ui2/Input";
import { Textarea } from "@/components/ui2/Textarea";
import { Card } from "../../../components/ui2/Card";
import { Toggle } from "../../../components/ui2/Toggle";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import trackApi from "@/lib/api/trackApi";
import { useAuth } from "@/app/contexts/AuthContext";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  // Bỏ trường 'artist', giữ state 'artist' nếu backend bắt buộc nhưng không hiển thị
  // const [artist, setArtist] = useState(""); // <-- Bỏ state này nếu backend không cần
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadSuccess] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  // Giữ lại và mặc định là false, nhưng cho phép người dùng bật/tắt
  const [allowDownload, setAllowDownload] = useState(false);

  const router = useRouter();

  const { user } = useAuth();

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Xử lý chọn file âm thanh
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  // Xử lý chọn ảnh bìa
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa file
  const removeAudio = () => {
    setAudioFile(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Xử lý upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title.trim()) {
      toast.error("Vui lòng nhập tiêu đề và chọn file nhạc");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // 1. Tạo FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // Giả định backend dùng tên user làm artist nếu không có trường artist
      formData.append("artist", user.name || user.email || "Unknown Artist");
      formData.append("isPublic", String(isPublic));
      // THÊM: Gửi trạng thái cho phép tải xuống lên backend
      formData.append("allowDownload", String(allowDownload));

      // File nhạc (Bắt buộc)
      formData.append("audio", audioFile);

      // Ảnh bìa (Tùy chọn)
      if (coverFile) {
        formData.append("image", coverFile);
      }

      // 2. Gọi API
      await trackApi.uploadTrack(formData);

      setUploadSuccess(true);
      toast.success("Tải lên thành công!");

      // 3. Chuyển hướng về trang cá nhân sau 1s
      setTimeout(() => {
        router.push(`/artist/${user.id}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi tải lên.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // THAY ĐỔI: Thay đổi max-w-3xl thành max-w-7xl để tận dụng chiều rộng, loại bỏ cuộn ngang không cần thiết
    <div className="min-h-screen bg-white dark:bg-linear-to-b dark:from-black dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-7xl mx-auto lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Tải lên bài hát của bạn
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chia sẻ âm nhạc với thế giới một cách dễ dàng
          </p>
        </div>

        <Card className="bg-gray-100 border-none dark:bg-zinc-900/50  p-6 lg:p-10 ">
          <form onSubmit={handleSubmit}>
            {/* THAY ĐỔI: Sử dụng Grid 2 cột trên desktop để tận dụng đủ width, tránh cuộn */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cột 1: Audio & Cover Upload */}
              <div className="lg:col-span-1 space-y-6">
                {/* Upload Audio */}
                <div>
                  <label className="flex items-center gap-2 font-semibold">
                    <AudioWaveform className="h-4 w-4 text-orange-500" />
                    File âm thanh <span className="text-orange-500">*</span>
                  </label>
                  {!audioFile ? (
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors group h-40 flex flex-col items-center justify-center"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kéo thả hoặc{" "}
                        <span className="text-orange-500 underline font-medium">
                          chọn file
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        MP3, WAV, FLAC
                      </p>
                      <input
                        ref={audioInputRef}
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="hidden"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-orange-500/10 dark:bg-zinc-800 rounded-lg p-4 border border-orange-500">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {audioFile.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={removeAudio}
                        className="h-8 w-8 text-gray-900 dark:text-white hover:bg-orange-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Upload Cover */}
                <div>
                  <label className="flex items-center gap-2 font-semibold">
                    <ImageIcon className="h-4 w-4 text-orange-500" />
                    Ảnh bìa{" "}
                    <span className="text-muted-foreground">
                      (khuyến khích)
                    </span>
                  </label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500 transition-colors group aspect-square flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    {!coverPreview ? (
                      <>
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400 dark:text-zinc-500 group-hover:text-pink-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          JPG, PNG (Khuyến khích 1:1)
                        </p>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          className="object-cover"
                          fill
                          unoptimized
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCover();
                          }}
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Cột 2: Metadata & Cài đặt */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tiêu đề */}
                <div>
                  <label
                    htmlFor="title"
                    className="text-gray-900 dark:text-white font-semibold"
                  >
                    📝 Tiêu đề bài hát *
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài hát của bạn..."
                    className="mt-2 bg-white/50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Bỏ trường Nghệ sĩ theo yêu cầu */}
                {/* <div>
                  <label htmlFor="artist" className="text-gray-900 dark:text-white font-semibold">
                    Nghệ sĩ
                  </label>
                  <Input
                    id="artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Tên bạn hoặc nhóm..."
                    className="mt-2 bg-white/50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div> */}

                {/* Mô tả */}
                <div>
                  <label
                    htmlFor="description"
                    className="text-gray-900 dark:text-white font-semibold"
                  >
                    💬 Mô tả (tùy chọn)
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nói gì đó về bài hát này, cảm hứng, lời bài hát..."
                    rows={5}
                    className="mt-2 bg-white/50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Privacy & Permissions */}
                <div className="space-y-6 pt-4 border-t border-gray-300 dark:border-zinc-700">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                    Cài đặt Quyền
                  </h3>

                  <div className="space-y-5">
                    {/* Public Track */}
                    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="flex-1">
                        <label className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                          <Music className="h-5 w-5 text-orange-500" />
                          Phát hành Công khai
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Bất kỳ ai cũng có thể tìm thấy và nghe bài hát này
                          trên nền tảng.
                        </p>
                      </div>
                      <Toggle
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        className="data-[state=on]:bg-orange-500"
                      />
                    </div>

                    {/* Allow Downloads (Giữ lại và làm nổi bật) */}
                    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="flex-1">
                        <label className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                          <Download className="h-5 w-5 text-pink-500" />
                          Cho phép Tải xuống
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Người nghe có thể tải file âm thanh gốc về thiết bị cá
                          nhân.
                        </p>
                      </div>
                      <Toggle
                        checked={allowDownload}
                        onCheckedChange={setAllowDownload}
                        className="data-[state=on]:bg-pink-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-300 dark:border-zinc-700">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isUploading}
                    onClick={() => router.back()} // Dùng router.back() cho tiện
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={!audioFile || !title || isUploading}
                    className="bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-orange-500/30"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Hoàn tất Tải lên
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {/* Kết thúc layout 2 cột */}
            </div>
          </form>
        </Card>

        {/* Tips */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            💡 Mẹo: Sử dụng ảnh bìa vuông (1:1), độ phân giải cao (ví dụ:
            1000x1000px) để có chất lượng tốt nhất.
          </p>
        </div>
      </div>
    </div>
  );
}
