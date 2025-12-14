// src/components/modals/ReportModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import reportApi from "@/lib/api/reportApi";
import { ReportReason } from "@repo/database";

import AOS from "aos";
import "aos/dist/aos.css";

// ---------------- Types ----------------
interface ReportFormData {
  reportReasonId: string;
  message: string;
}

interface ReportModalProps {
  trackId: string;
  trackTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ---------------- Utils ----------------
const formatReasonLabel = (reason: string) =>
  reason
    ?.replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Unknown Reason";

// ---------------- Component ----------------
export default function ReportModal({
  trackId,
  trackTitle,
  isOpen,
  onOpenChange,
}: ReportModalProps) {
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [isClosing, setIsClosing] = useState(false); // ⭐ animation đóng

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ReportFormData>({
    mode: "onChange",
    defaultValues: {
      reportReasonId: "",
      message: "",
    },
  });

  // Init AOS
  useEffect(() => {
    AOS.init({
      duration: 280,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  // Refresh AOS khi mở modal
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setTimeout(() => AOS.refresh(), 50);
    }
  }, [isOpen]);

  // Fetch reasons
  useEffect(() => {
    if (isOpen && reasons.length === 0) {
      reportApi
        .getReportReasons()
        .then((res) => {
          const fetched = res.data;
          setReasons(fetched);
          reset({
            reportReasonId: fetched[0]?.id || "",
            message: "",
          });
        })
        .catch(() => toast.error("Failed to load report reasons."));
    }

    if (!isOpen) reset();
  }, [isOpen, reasons.length, reset]);

  // Handle close with animation
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsClosing(true);
      const CLOSE_DURATION = 260;

      setTimeout(() => {
        onOpenChange(false);
        setIsClosing(false);
      }, CLOSE_DURATION);
    }
  };

  // Submit
  const onSubmit: SubmitHandler<ReportFormData> = async (data) => {
    if (!user) {
      toast.error("You must be logged in to report a track.");
      return;
    }

    setIsLoading(true);
    try {
      await reportApi.createReport({
        trackId,
        reportReasonId: data.reportReasonId,
        message: data.message || undefined,
      });

      toast.success("Report submitted successfully!");
      handleOpenChange(false);
    } catch {
      toast.error("Failed to submit report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        {/* Content */}
        <Dialog.Content
          data-aos={!isClosing ? "zoom-in" : undefined}
          className={`fixed left-1/2 top-1/2 w-[90vw] max-w-[450px] max-h-[85vh]
            -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#121212]
            shadow-2xl border border-gray-200 dark:border-white/10
            overflow-hidden flex flex-col z-50
            transition-all duration-300
            ${isClosing ? "animate-modal-out" : ""}
          `}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <Dialog.Title className="text-xl font-bold">
              Report Track
            </Dialog.Title>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are reporting:{" "}
                <strong className="text-[#ff5500]">{trackTitle}</strong>
              </p>

              {/* Reasons */}
              <div className="space-y-3">
                {reasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition
                      ${
                        watch("reportReasonId") === reason.id
                          ? "border-[#ff5500] bg-[#ff5500]/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      value={reason.id}
                      {...register("reportReasonId", { required: true })}
                      className="mt-1"
                    />
                    <span className="text-sm font-medium">
                      {formatReasonLabel(reason.reason)}
                    </span>
                  </label>
                ))}
                {errors.reportReasonId && (
                  <p className="text-xs text-red-500">
                    Please select a reason.
                  </p>
                )}
              </div>

              {/* Message */}
              <textarea
                {...register("message")}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 focus:border-[#ff5500] dark:text-white resize-none transition-all text-sm"
                placeholder="Additional message (optional)"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 text-sm rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="px-5 py-2 bg-[#ff5500] text-white rounded-md flex items-center gap-2 active:scale-95 transition"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                <Send size={16} />
                Submit
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
