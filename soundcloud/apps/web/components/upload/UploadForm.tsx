"use client";
import { useState } from "react";
import { UploadZone } from "./UploadZone";
import { Input } from "../ui2/Input";
import { Textarea } from "../ui2/Textarea";
import { Button } from "../ui2/Button";
import trackApi from "@/lib/api/trackApi";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !title) return;
    setLoading(true);

    try {
      // 1. Lấy presigned URL (giả lập)
      const { data } = await trackApi.createTrack({
        title,
        description,
        genre,
        isPublic,
      });
      // 2. Upload file lên S3
      // await fetch(presignedUrl, { method: "PUT", body: file });
      alert("Upload thành công!");
    } catch (err) {
      alert("Lỗi upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {!file ? (
        <UploadZone onFileAccepted={setFile} />
      ) : (
        <>
          <div className="bg-gray-900 rounded-lg p-6 flex items-center gap-4">
            <div className="bg-linear-to-br from-orange-600 to-purple-600 w-20 h-20 rounded" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <Input
            label="Tiêu đề *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Input
            label="Thể loại"
            placeholder="Hip-hop, Electronic..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span>Công khai</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setFile(null)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title || loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Đang tải..." : "Đăng tải"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
