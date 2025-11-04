"use client";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileAccepted: (file: File | undefined) => void;
}

export function UploadZone({ onFileAccepted }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [] },
    maxFiles: 1,
    onDropAccepted: (files) => onFileAccepted(files[0]),
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-orange-600 bg-orange-600/10"
          : "border-gray-700 hover:border-gray-600"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
      <p className="text-lg font-medium">
        {isDragActive ? "Thả file vào đây..." : "Kéo & thả file MP3 hoặc click để chọn"}
      </p>
      <p className="text-sm text-gray-500 mt-2">Chỉ hỗ trợ file MP3, WAV, tối đa 200MB</p>
    </div>
  );
}