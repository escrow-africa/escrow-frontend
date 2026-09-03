"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Camera, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface PersonalInfoFormProps {
  initialData: {
    fullName: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
  } | null;
  onCancel: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatarUrl?: string;
    avatarFile?: File;
  }) => Promise<void>;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export default function PersonalInfoForm({
  initialData,
  onCancel,
  onSave,
}: PersonalInfoFormProps) {
  const [avatar, setAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Split fullName into firstName and lastName
  const getNames = (fullName: string) => {
    const parts = (fullName || "").trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

  const { firstName, lastName } = getNames(initialData?.fullName || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: initialData?.email || "",
      bio: initialData?.bio || "",
    },
  });

  // Sync initialData changes (if fetched asynchronously)
  useEffect(() => {
    if (initialData) {
      const { firstName, lastName } = getNames(initialData.fullName);
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", initialData.email);
      setValue("bio", initialData.bio || "");
    }
  }, [initialData, setValue]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Avatar preview updated. Click Save to apply.");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave({
        ...data,
        avatarUrl: avatar || undefined,
        avatarFile: avatarFile || undefined,
      });
    } catch (err) {
      // handled by parent
    }
  };

  // Initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "MN";

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Back to Settings Link */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium text-sm focus:outline-none"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-[#18181b] border border-border dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Profile Card Header with Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8">
          {/* Interactive Avatar Container */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-20 h-20 rounded-full bg-[#E5ECE9] dark:bg-[#1f2937] border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-primary dark:text-[#F3B659] text-2xl font-bold overflow-hidden shadow-inner select-none transition-transform duration-200 hover:scale-105">
              {avatar || initialData?.avatarUrl ? (
                <img
                  src={avatar || initialData?.avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {/* Camera Overlay Icon */}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-white dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-gray-500 group-hover:text-primary dark:group-hover:text-[#F3B659] transition-colors">
              <Camera size={14} />
            </div>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-primary dark:text-[#F3B659]">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update your public profile, contact details, and routing email address.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                  errors.firstName ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                  errors.lastName ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Contact Email Address
            </label>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
            )}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
              To change your primary login email, please contact customer integrity desks.
            </p>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-[0.2em] mb-2 uppercase">
              Biography
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about yourself..."
              className={`w-full px-4 py-3 rounded-lg border bg-[#E4E3E3CC] dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] focus:bg-white dark:focus:bg-zinc-900 transition-all resize-none ${
                errors.bio ? "border-red-500 focus:ring-red-500" : ""
              }`}
              {...register("bio", { required: "Biography is required" })}
            />
            {errors.bio && (
              <p className="mt-1.5 text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F3D2E] dark:bg-[#185541] text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-[#236b53] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
