"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Camera,
  X,
  Loader2,
  Trash2,
  PlusCircle,
  Link as LinkIcon,
  Music,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import websiteTypeApi from "@/lib/api/websiteTypeApi";
import userApi from "@/lib/api/usersApi";
import { WebsiteType } from "@repo/database";

interface EditFormData {
  name: string;
  location: string;
  bio: string;
  socialLinks: {
    id?: string;
    url: string;
    websiteTypeId: string;
    websiteType?: WebsiteType;
  }[];
}

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getSocialIcon = (typeCode: string = "", size: number = 18) => {
  const code = typeCode.toUpperCase();
  switch (code) {
    case "YOUTUBE":
      return <Music size={size} />;
    case "INSTAGRAM":
      return <Instagram size={size} />;
    default:
      return <LinkIcon size={size} />;
  }
};

export default function EditProfileModal({ user, isOpen, onOpenChange }: EditProfileModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableWebsiteTypes, setAvailableWebsiteTypes] = useState<WebsiteType[]>([]);

  const defaultAvatar = "/images/default-avatar.png";
  const defaultCover = "/images/default-cover.jpg";

  const [avatarPreview, setAvatarPreview] = useState(user?.image || defaultAvatar);
  const [coverPreview, setCoverPreview] = useState(user?.profile?.coverUrl || defaultCover);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { register, control, handleSubmit, reset, watch } = useForm<EditFormData>({
    defaultValues: {
      name: user?.name || "",
      location: user?.profile?.location || "",
      bio: user?.profile?.bio || "",
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  useEffect(() => {
    websiteTypeApi.getWebsiteTypes().then((res) => {
      const types = res.data.data;
      // Ensure Instagram is available (Mock if DB doesn't have it yet)
      if (!types.find((t: WebsiteType) => t.type === "INSTAGRAM")) {
        types.push({
          id: "instagram-mock",
          type: "INSTAGRAM",
          icon: "instagram",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as WebsiteType);
      }
      setAvailableWebsiteTypes(types);
    });
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name || "",
        location: user.profile?.location || "",
        bio: user.profile?.bio || "",
        socialLinks:
          user.profile?.websiteProfiles.map((p: any) => ({
            id: p.id,
            url: p.url,
            websiteTypeId: p.websiteTypeId,
            websiteType: p.websiteType,
          })) || [],
      });

      setAvatarPreview(user.image || defaultAvatar);
      setCoverPreview(user.profile?.coverUrl || defaultCover);
      setAvatarFile(null);
      setCoverFile(null);
    }
  }, [user, isOpen, reset]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string) => void,
    fieldName: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) {
        toast.error("File size cannot exceed 5MB or invalid file type.");
        e.target.value = "";
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(null);
      setPreview(
        fieldName === "avatar"
          ? user?.image || defaultAvatar
          : user?.profile?.coverUrl || defaultCover
      );
    }
  };

  const onSubmit = async (data: EditFormData) => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      const socialLinksPayload = data.socialLinks
        .filter((link) => link.url && link.websiteTypeId)
        .map((link) => ({
          url: link.url,
          websiteTypeId: link.websiteTypeId,
        }));

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("bio", data.bio);

      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("cover", coverFile);

      formData.append("websiteProfiles", JSON.stringify(socialLinksPayload));

      await userApi.updateUser(user.id, formData);

      toast.success("Profile updated successfully!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Update Profile Error:", error);

      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const SocialLinkManager = () => (
    <div className="space-y-4">
      <h4 className="font-bold text-gray-800 dark:text-gray-200">
        Social Links ({fields.length})
      </h4>

      {fields.map((field, index) => {
        const selectedType = availableWebsiteTypes.find(
          (type) => type.id === watch(`socialLinks.${index}.websiteTypeId`)
        );

        return (
          <div
            key={field.id}
            className="flex gap-2 items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10"
          >
            {/* 1. Website Type (Dropdown) */}
            <div className="w-1/3 shrink-0">
              <label className="sr-only">Platform</label>
              <div className="relative">
                <select
                  {...register(`socialLinks.${index}.websiteTypeId`, {
                    required: true,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-[#1f1f1f] text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5500] dark:text-white appearance-none pr-8"
                  defaultValue={
                    field.websiteTypeId || availableWebsiteTypes[0]?.id
                  }
                >
                  {availableWebsiteTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                  {getSocialIcon(selectedType?.type || "", 16)}
                </div>
              </div>
            </div>

            {/* 2. URL Input */}
            <div className="grow">
              <label className="sr-only">URL</label>
              <input
                {...register(`socialLinks.${index}.url`, {
                  required: true,
                  pattern: /^https?:\/\/.*/,
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5500] dark:text-white"
                placeholder={`Enter ${selectedType?.type || "Website"
                  } URL (e.g., https://...)`}
              />
            </div>

            {/* 3. Delete Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition shrink-0"
              title="Remove link"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}

      {/* Add New Link Button */}
      <button
        type="button"
        onClick={() => {
          if (availableWebsiteTypes.length > 0) {
            append({
              url: "",
              websiteTypeId: availableWebsiteTypes[0]?.id || "",
              websiteType: availableWebsiteTypes[0],
            });
          } else {
            toast.error("No website types available to add.");
          }
        }}
        className="flex items-center gap-2 text-sm text-[#ff5500] hover:text-[#e04b00] transition font-medium mt-3"
        disabled={availableWebsiteTypes.length === 0}
      >
        <PlusCircle size={18} /> Add Social Link
      </button>
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white dark:bg-[#121212] p-0 shadow-2xl focus:outline-none z-50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-white/10">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white outline-none transition"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6 space-y-8">
              {/* 1. Images Section */}
              <div className="flex gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0 relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/20 relative shadow-md">
                    <Image
                      src={avatarPreview}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="96px"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition backdrop-blur-[1px]">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleImageChange(
                        e,
                        setAvatarFile,
                        setAvatarPreview,
                        "avatar"
                      )
                    }
                  />
                </div>

                {/* Cover Image */}
                <div className="flex-1 relative group cursor-pointer h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                  <Image
                    src={coverPreview}
                    alt="Cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                      <Camera size={18} /> Change Header Image
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleImageChange(
                        e,
                        setCoverFile,
                        setCoverPreview,
                        "cover"
                      )
                    }
                  />
                </div>
              </div>

              {/* 2. Text Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 focus:border-[#ff5500] dark:text-white transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    City / Country
                  </label>
                  <input
                    {...register("location")}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 focus:border-[#ff5500] dark:text-white transition-all"
                    placeholder="Where are you from?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 focus:border-[#ff5500] dark:text-white resize-none transition-all"
                    placeholder="Tell the world a bit about yourself"
                  />
                </div>
              </div>

              {/* 3. Social Links Manager */}
              <SocialLinkManager />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 flex justify-end gap-3 border-t border-gray-100 dark:border-white/10">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition hover:bg-gray-100 dark:hover:bg-white/10 rounded-md"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-[#ff5500] hover:bg-[#e04b00] text-white text-sm font-bold rounded-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
