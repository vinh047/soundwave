"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui2/Dialog";
import { Button } from "../ui/Button";
import { Textarea } from "../ui2/Textarea";
import axios from "axios";

interface ReportModalProps {
  trackId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasons = [
  { id: "1", reason: "Vi phạm bản quyền" },
  { id: "2", reason: "Nội dung không phù hợp" },
  { id: "3", reason: "Spam" },
  { id: "4", reason: "Khác" },
];

export function ReportModal({ trackId, open, onOpenChange }: ReportModalProps) {
  const [reasonId, setReasonId] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    if (!reasonId) return;
    await axios.post("/api/reports", {
      trackId,
      reportReasonId: reasonId,
      description: note,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Báo cáo bài hát</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <select
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Chọn lý do</option>
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.reason}
              </option>
            ))}
          </select>

          <Textarea
            placeholder="Mô tả thêm (tùy chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex gap-3">
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reasonId}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Gửi báo cáo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
