"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  AlertTriangle,
  Laptop,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  LogOut,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authApi, SessionItem } from "../../../api/auth";

interface SecurityFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export type DeviceCategory = "Android" | "iOS" | "Laptop" | "Desktop";

interface ParsedDeviceInfo {
  category: DeviceCategory;
  name: string;
  browser: string;
  os: string;
}

const parseSessionDevice = (session: SessionItem, isCurrentSession: boolean): ParsedDeviceInfo => {
  const anySession = session as any;

  // 1. Collect all available signals from session (handling camelCase, snake_case, nested objects)
  let ua = (
    session.userAgent ||
    anySession.user_agent ||
    anySession.agent ||
    anySession.ua ||
    ""
  ).trim();

  let os = (
    (typeof session.os === "string" ? session.os : anySession.os?.name) ||
    anySession.operatingSystem ||
    anySession.platform ||
    ""
  ).trim();

  let device = (
    (typeof session.device === "string" ? session.device : anySession.device?.type || anySession.device?.name || anySession.device?.model) ||
    anySession.deviceType ||
    anySession.device_type ||
    anySession.type ||
    ""
  ).trim();

  let browser = (
    (typeof session.browser === "string" ? session.browser : anySession.browser?.name || anySession.client?.name) ||
    anySession.client ||
    ""
  ).trim();

  // 2. If session has no user agent and it's the current session, inspect window.navigator
  if (!ua && isCurrentSession && typeof window !== "undefined") {
    ua = navigator.userAgent || "";
    if (!os && navigator.platform) {
      os = navigator.platform;
    }
  }

  const combined = `${device} ${os} ${browser} ${ua}`.toLowerCase();

  // 3. Detect Browser if not already known
  if (!browser && ua) {
    if (ua.includes("Firefox/")) browser = "Firefox";
    else if (ua.includes("Edg/")) browser = "Edge";
    else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
    else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
    else if (ua.includes("Opera/") || ua.includes("OPR/")) browser = "Opera";
    else browser = "Browser";
  } else if (!browser) {
    browser = "Web Browser";
  }

  // 4. Classify device into: Android, iOS, Laptop, or Desktop
  let category: DeviceCategory = "Desktop";
  let deviceLabel = "";

  // Check Android
  if (combined.includes("android")) {
    category = "Android";
    const isTablet = combined.includes("tablet") || combined.includes("sm-t") || combined.includes("tab");
    deviceLabel = isTablet ? "Android Tablet" : "Android Phone";
    if (!os || os.toLowerCase() === "linux") os = "Android";
  }
  // Check iOS
  else if (
    combined.includes("iphone") ||
    combined.includes("ipad") ||
    combined.includes("ipod") ||
    combined.includes("ios") ||
    (combined.includes("macintosh") && typeof window !== "undefined" && isCurrentSession && navigator.maxTouchPoints > 1)
  ) {
    category = "iOS";
    if (combined.includes("ipad")) {
      deviceLabel = "iPad (iOS)";
    } else if (combined.includes("iphone")) {
      deviceLabel = "iPhone (iOS)";
    } else {
      deviceLabel = "iOS Device";
    }
    if (!os) os = "iOS";
  }
  // Check Laptop (MacBook, Chromebook, Notebook, ThinkPad, Laptop or portable devices)
  else if (
    combined.includes("laptop") ||
    combined.includes("notebook") ||
    combined.includes("macbook") ||
    combined.includes("chromebook") ||
    combined.includes("thinkpad") ||
    combined.includes("latitude") ||
    combined.includes("xps") ||
    combined.includes("surface") ||
    ((combined.includes("macintosh") || combined.includes("mac os")) && !combined.includes("imac") && !combined.includes("mac mini") && !combined.includes("mac pro"))
  ) {
    category = "Laptop";
    if (combined.includes("macbook") || combined.includes("macintosh") || combined.includes("mac os")) {
      deviceLabel = "MacBook (Laptop)";
      if (!os) os = "macOS";
    } else if (combined.includes("chromebook")) {
      deviceLabel = "Chromebook (Laptop)";
      if (!os) os = "ChromeOS";
    } else if (combined.includes("windows")) {
      deviceLabel = "Windows Laptop";
      if (!os) os = "Windows";
    } else {
      deviceLabel = "Laptop";
    }
  }
  // Check Desktop
  else if (
    combined.includes("desktop") ||
    combined.includes("windows") ||
    combined.includes("linux") ||
    combined.includes("x11") ||
    combined.includes("imac") ||
    combined.includes("mac mini") ||
    combined.includes("mac pro") ||
    combined.includes("pc") ||
    combined.includes("tower")
  ) {
    category = "Desktop";
    if (combined.includes("windows")) {
      deviceLabel = "Windows Desktop";
      if (!os) os = "Windows";
    } else if (combined.includes("imac") || combined.includes("mac mini") || combined.includes("mac pro")) {
      deviceLabel = "Mac (Desktop)";
      if (!os) os = "macOS";
    } else if (combined.includes("linux")) {
      deviceLabel = "Linux Desktop";
      if (!os) os = "Linux";
    } else {
      deviceLabel = "Desktop Computer";
    }
  }
  // Safe Fallback (never say Unknown Device)
  else {
    if (combined.includes("mobile")) {
      category = "Android";
      deviceLabel = "Android Phone";
      if (!os) os = "Android";
    } else {
      category = "Desktop";
      deviceLabel = "Desktop Computer";
      if (!os) os = "Desktop";
    }
  }

  const formattedTitle = browser && browser !== "Web Browser" && !deviceLabel.toLowerCase().includes(browser.toLowerCase())
    ? `${browser} on ${deviceLabel}`
    : deviceLabel;

  return {
    category,
    name: formattedTitle,
    browser,
    os: os || category,
  };
};

const getDeviceCategoryIcon = (category: DeviceCategory, name: string) => {
  switch (category) {
    case "Android":
      return name.includes("Tablet") ? (
        <Tablet size={18} className="text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Smartphone size={18} className="text-emerald-600 dark:text-emerald-400" />
      );
    case "iOS":
      return name.includes("iPad") ? (
        <Tablet size={18} className="text-purple-600 dark:text-purple-400" />
      ) : (
        <Smartphone size={18} className="text-purple-600 dark:text-purple-400" />
      );
    case "Laptop":
      return <Laptop size={18} className="text-blue-600 dark:text-blue-400" />;
    case "Desktop":
      return <Monitor size={18} className="text-slate-600 dark:text-zinc-400" />;
  }
};

const getCategoryBadgeStyles = (category: DeviceCategory) => {
  switch (category) {
    case "Android":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60";
    case "iOS":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-900/60";
    case "Laptop":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900/60";
    case "Desktop":
      return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";
  }
};

const formatSessionTime = (dateStr?: string) => {
  if (!dateStr) return "Recently active";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Active just now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return `Last active ${date.toLocaleDateString()}`;
  } catch {
    return dateStr;
  }
};

const isCurrentSession = (session: SessionItem) => {
  return Boolean(session.isCurrent || session.current);
};

const getSessionId = (session: SessionItem) => {
  return String(session.sessionId || session.id || session._id || "");
};

export default function SecurityForm({
  onCancel,
  onSave,
}: SecurityFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState("");
  const [isDeactivating] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [revokingOther, setRevokingOther] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [showRevokeOthersModal, setShowRevokeOthersModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      reset();
      toast.success("Security settings updated successfully!", { id: "settings-toast" });
    } catch {
      toast.error("Failed to update password.", { id: "settings-toast" });
    }
  };

  const handleDeactivate = () => {
    if (deactivateInput !== "DEACTIVATE") return;
    toast.error("Account deactivation is not connected to the backend yet.", { id: "settings-toast" });
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    setSessionError(null);
    try {
      const res = await authApi.getSessions();
      const list = res?.data?.sessions || res?.sessions || res?.data || (Array.isArray(res) ? res : []);
      setSessions(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setSessionError(err?.response?.data?.message || "Failed to load active browser sessions.");
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeOthers = async () => {
    setRevokingOther(true);
    try {
      await authApi.revokeOtherSessions();
      toast.success("Other active sessions revoked successfully", { id: "settings-toast" });
      setShowRevokeOthersModal(false);
      await fetchSessions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to revoke other sessions.", { id: "settings-toast" });
    } finally {
      setRevokingOther(false);
    }
  };

  const handleRevokeSpecific = async (sessionId: string) => {
    if (!sessionId) return;
    setRevokingId(sessionId);
    try {
      await authApi.revokeSession(sessionId);
      toast.success("Session revoked successfully", { id: "settings-toast" });
      setSessions((prev) => prev.filter((s) => getSessionId(s) !== sessionId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to revoke session.", { id: "settings-toast" });
    } finally {
      setRevokingId(null);
    }
  };

  const hasExplicitCurrent = sessions.some((s) => isCurrentSession(s));
  const otherSessionsCount = hasExplicitCurrent
    ? sessions.filter((s) => !isCurrentSession(s)).length
    : Math.max(0, sessions.length - 1);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0F3D2E] dark:hover:text-[#F3B659] mb-6 transition-colors font-medium text-sm focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main Column Stack */}
      <div className="space-y-6">
        {/* 1. Change Password Form Card */}
        <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ensure your password remains complex and synchronized.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Account Password */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                Current Account Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                  {...register("currentPassword", { required: "Current password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-2 uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] dark:focus:ring-[#F3B659] transition-all pr-12"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === newPassword || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Change Password Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3 bg-[#0F3D2E] dark:bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-[#185541] dark:hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Active Browser Sessions Card */}
        <div className="bg-white dark:bg-[#18181b] border border-[#E4E3E3CC] dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Browser Sessions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Logged in browser sessions currently linked to your escrow profile.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fetchSessions}
                disabled={loadingSessions}
                title="Refresh sessions"
                className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={16} className={loadingSessions ? "animate-spin" : ""} />
              </button>

              {otherSessionsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRevokeOthersModal(true)}
                  disabled={loadingSessions || revokingOther}
                  className="px-3.5 py-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <LogOut size={14} />
                  <span>Revoke Other Sessions</span>
                </button>
              )}
            </div>
          </div>

          {loadingSessions ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Loader2 size={24} className="animate-spin text-[#0F3D2E] dark:text-[#F3B659] mb-2" />
              <p className="text-xs">Loading active browser sessions...</p>
            </div>
          ) : sessionError ? (
            <div className="border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 rounded-xl p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{sessionError}</p>
              <button
                type="button"
                onClick={fetchSessions}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <p className="border border-dashed border-[#E4E3E3CC] dark:border-zinc-800 rounded-xl p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No active browser sessions found.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, idx) => {
                const sId = getSessionId(session) || `session-${idx}`;
                const isCurrent = hasExplicitCurrent ? isCurrentSession(session) : idx === 0;
                const isRevokingThis = revokingId === sId;
                const deviceInfo = parseSessionDevice(session, isCurrent);

                return (
                  <div
                    key={sId}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10"
                        : "border-[#E4E3E3CC] dark:border-zinc-800 bg-[#FAFBFA] dark:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 ${
                          isCurrent
                            ? "bg-emerald-100/60 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400"
                            : "bg-white dark:bg-zinc-800 border-[#E4E3E3CC] dark:border-zinc-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {getDeviceCategoryIcon(deviceInfo.category, deviceInfo.name)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                            {deviceInfo.name}
                          </h4>
                          {/* Device Category Badge: Android, iOS, Laptop, or Desktop */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wider uppercase ${getCategoryBadgeStyles(
                              deviceInfo.category
                            )}`}
                          >
                            {deviceInfo.category}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Current Session
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {deviceInfo.browser && deviceInfo.browser !== "Web Browser" && (
                            <span>Browser: {deviceInfo.browser}</span>
                          )}
                          {deviceInfo.os && (
                            <span>OS: {deviceInfo.os}</span>
                          )}
                          {(session.ipAddress || session.ip) && (
                            <span>IP: {session.ipAddress || session.ip}</span>
                          )}
                          {(session.location || session.city || session.country) && (
                            <span>
                              {session.location || [session.city, session.country].filter(Boolean).join(", ")}
                            </span>
                          )}
                          <span>
                            {formatSessionTime(session.lastActive || session.lastActiveAt || session.updatedAt || session.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center shrink-0">
                      {isCurrent ? (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Active Now
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRevokeSpecific(sId)}
                          disabled={isRevokingThis || revokingOther}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isRevokingThis ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Revoking...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={12} />
                              <span>Revoke</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Danger Zone Card */}
        <div className="bg-[#FFF5F5] dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex gap-4 items-start mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-800 dark:text-red-400">DANGER ZONE</h2>
              <p className="text-sm text-red-600/80 dark:text-red-300/60 mt-1">
                Irreversible structural changes to your professional broker account.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-950/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                Deactivate and Terminate Ledger Connection
              </h3>
              <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1 max-w-lg">
                This will release any active ad campaigns, revoke pending payouts, and deactivate your verified broker status.
              </p>
            </div>
            <button
              onClick={() => {
                setDeactivateInput("");
                setShowDeactivateModal(true);
              }}
              className="px-6 py-3 bg-[#E11D48] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 uppercase tracking-wider animate-pulse hover:animate-none"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal Overlay */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center relative animate-scale-in">
            {/* Warning Circle Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-5">
              <AlertTriangle size={28} />
            </div>

            {/* Modal Titles */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Deactivate Broker Profile?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              This action cannot be undone. You will lose access to active ad pipelines, transaction histories, and trading credibility records.
            </p>

            {/* Prompt */}
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-3">
              To confirm deactivation, please type <span className="text-red-500 font-bold">DEACTIVATE</span> in the field below:
            </p>

            {/* Input Box */}
            <input
              type="text"
              placeholder="DEACTIVATE"
              value={deactivateInput}
              onChange={(e) => setDeactivateInput(e.target.value)}
              className="w-full text-center px-4 py-3.5 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold placeholder-red-300 dark:placeholder-red-900/50 transition-all mb-6 uppercase"
            />

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={isDeactivating}
                className="px-5 py-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivateInput !== "DEACTIVATE" || isDeactivating}
                className="px-5 py-3 bg-[#E11D48] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeactivating ? "Deactivating..." : "Confirm Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Others Confirmation Modal */}
      {showRevokeOthersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center relative animate-scale-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-5">
              <LogOut size={28} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Revoke Other Sessions?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              This will immediately log out all other active browser sessions and devices. Only this current session will remain authenticated.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowRevokeOthersModal(false)}
                disabled={revokingOther}
                className="px-5 py-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeOthers}
                disabled={revokingOther}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {revokingOther ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Revoking...</span>
                  </>
                ) : (
                  <span>Yes, Revoke</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
