"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui2/Button";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function TrackActionsDropdown({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <Button
        variant="ghost"
        className="h-9 w-9 p-0 rounded-full"
        onClick={() => {
          setOpen((p) => !p);
          setConfirmDelete(false);
        }}
      >
        <MoreHorizontal className="h-5 w-5 text-zinc-400" />
      </Button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false);
              setConfirmDelete(false);
            }}
          />

          {/* Menu */}
          <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg animate-in fade-in zoom-in-95 overflow-hidden">
            {!confirmDelete ? (
              <>
                <button
                  onClick={() => {
                    onEdit();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Pencil className="h-4 w-4" />
                  Chỉnh sửa
                </button>

                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Xoá bài hát
                </button>
              </>
            ) : (
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Bạn chắc chắn?
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Huỷ
                  </Button>

                  <Button
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      onDelete();
                      setOpen(false);
                      setConfirmDelete(false);
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
