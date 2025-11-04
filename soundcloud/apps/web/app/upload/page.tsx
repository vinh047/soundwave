// app/upload/page.tsx  (hoặc components/UploadPage.tsx)
"use client";

import { useState, useRef } from "react";
import { Upload, X, Music, Loader2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui2/Button";
import { Input } from "@/components/ui2/Input";
import { Textarea } from "@/components/ui2/Textarea";
import { Card } from "../../components/ui2/Card";
import { Toggle } from "../../components/ui2/Toggle";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadSuccess] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [allowDownload, setAllowDownload] = useState(false);

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

  // Giả lập upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title.trim()) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Giả lập thời gian upload
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsUploading(false);
    setUploadSuccess(true);

    // Reset form sau 2s
    setTimeout(() => {
      setTitle("");
      setArtist("");
      setDescription("");
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      setUploadSuccess(false);
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-zinc-900 to-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Tải lên bài hát của bạn
          </h1>
          <p className="text-gray-400">Chia sẻ âm nhạc với thế giới</p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Audio */}
            <div>
              <label htmlFor="audio" className="text-white mb-3 block">
                File âm thanh <span className="text-orange-500">*</span>
              </label>
              {!audioFile ? (
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors group"
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <p className="text-sm text-gray-400">
                    Kéo thả hoặc{" "}
                    <span className="text-orange-500 underline">chọn file</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP3, WAV, FLAC (tối đa 100MB)
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
                <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">{audioFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={removeAudio}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Cover */}
            <div>
              <label htmlFor="cover" className="text-white mb-3 block">
                Ảnh bìa (khuyến khích)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="sm:col-span-1 border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors group aspect-square flex flex-col items-center justify-center"
                >
                  {!coverPreview ? (
                    <>
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-zinc-500 group-hover:text-orange-500" />
                      <p className="text-xs text-gray-400">JPG, PNG</p>
                    </>
                  ) : (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCover();
                        }}
                        className="absolute top-1 right-1 h-6 w-6 bg-black/50"
                      >
                        <X className="h-3 w-3" />
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

                {/* Form inputs */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label htmlFor="title">Tiêu đề bài hát *</label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nhập tiêu đề..."
                      className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="artist">Nghệ sĩ</label>
                    <Input
                      id="artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Tên bạn hoặc nhóm..."
                      className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label htmlFor="description">Mô tả (tùy chọn)</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nói gì đó về bài hát này..."
                rows={3}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 resize-none"
              />
            </div>

            {/* Privacy & Permissions */}
            <div className="space-y-6 pt-4 border-t border-zinc-700">
              <h3 className="text-white font-semibold text-sm">
                Quyền riêng tư & Cài đặt
              </h3>

              <div className="space-y-5">
                {/* Public Track */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="text-white font-medium">
                      Public Track
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Bất kỳ ai cũng có thể tìm và nghe bài hát này
                    </p>
                  </div>
                  <Toggle
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="data-[state=on]:bg-orange-500"
                  />
                </div>

                {/* Allow Downloads */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="text-white font-medium">
                      Cho phép tải xuống
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Người nghe có thể tải bài hát về máy
                    </p>
                  </div>
                  <Toggle
                    checked={allowDownload}
                    onCheckedChange={setAllowDownload}
                    className="data-[state=on]:bg-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isUploading}
                onClick={() => window.history.back()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!audioFile || !title || isUploading}
                className="bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Tải lên
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Mẹo: Sử dụng ảnh bìa 1400x1400px để có chất lượng tốt nhất</p>
        </div>
      </div>
    </div>
  );
}
