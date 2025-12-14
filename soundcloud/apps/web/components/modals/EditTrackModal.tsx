"use client";

import { useState, useRef, useEffect } from "react";
// ... (các imports khác)
import { Track } from "@repo/database";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui2/Button";
import { Input } from "@/components/ui2/Input";
import { Textarea } from "@/components/ui2/Textarea";
import { Toggle } from "@/components/ui2/Toggle";
import { toast } from "sonner";
import trackApi from "@/lib/api/trackApi";

interface EditTrackModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
  // Đổi tên để rõ ràng hơn: hàm này sẽ trigger việc refresh data
  onUpdateSuccess: () => void;
}

export default function EditTrackModal({
  track,
  isOpen,
  onClose,
  onUpdateSuccess,
}: EditTrackModalProps) {
  // ... (các state không đổi)
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description || "");
  const [isPublic, setIsPublic] = useState(track.isPublic);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    track.imagePath
  );
  const [isSaving, setIsSaving] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);

  // Reset form khi mở modal với track khác
  useEffect(() => {
    if (isOpen) {
      setTitle(track.title);
      setDescription(track.description || "");
      setIsPublic(track.isPublic);
      setCoverPreview(track.imagePath);
      setCoverFile(null);
    }
  }, [track, isOpen]);

  if (!isOpen) return null;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isPublic", String(isPublic));

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Gửi request update
      await trackApi.updateTrackByOwner(track.id, formData);

      toast.success("Cập nhật thành công!");

      // Gọi hàm refresh data được truyền từ TracksManager
      onUpdateSuccess();

      // Không gọi onClose() ở đây, để `onUpdateSuccess` (router.refresh)
      // có thể force re-render/unmount modal. Hoặc gọi sau khi action thành công.
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật bài hát");
    } finally {
      setIsSaving(false);
    }
  };

  // ... (Phần render không đổi)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      {/* ... (Nội dung Modal) */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa bài hát
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Cover Image */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ảnh bìa
                </label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="aspect-square relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-orange-500 cursor-pointer group bg-gray-50 dark:bg-zinc-800 flex items-center justify-center"
                >
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverChange}
                />
                <p className="text-xs text-center mt-2 text-gray-500">
                  Nhấn để thay đổi
                </p>
              </div>

              {/* Info Inputs */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tiêu đề
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 bg-gray-100 dark:bg-zinc-800 border-transparent focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mô tả
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 bg-gray-100 dark:bg-zinc-800 border-transparent focus:border-orange-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Công khai (Public)
                  </span>
                  <p className="text-xs text-gray-500">
                    Mọi người có thể nhìn thấy bài hát này
                  </p>
                </div>
                <Toggle
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=on]:bg-orange-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/50 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="edit-form"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
