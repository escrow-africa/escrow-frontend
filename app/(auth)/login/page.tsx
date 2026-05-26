"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import type { LoginData } from "@/components/Interface";

export default function Login() {
  const router = useRouter();

  const loginUser = useAuthStore((state) => state.login);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);

  const [view, setView] = useState<"login" | "forgot" | "verify-reset" | "new-password">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      await loginUser(data);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await requestOtp({ email: resetEmail });
      toast.success("OTP code sent to your email");
      setView("verify-reset");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  const handleVerifyOtpCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Enter a valid 6-digit OTP code");
      return;
    }
    // Proceed to password input screen
    setView("new-password");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPassword({
        email: resetEmail,
        otp: otpCode,
        password: newPassword
      });
      toast.success("Password reset successful. Please login.");
      // Reset forms and view
      setView("login");
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Password reset failed"
      );
    }
  };

  const renderHeader = () => {
    switch (view) {
      case "forgot":
        return (
          <>
            <h1 className="font-bold text-4xl mt-3">FORGOT</h1>
            <h1 className="text-[#F3B659] font-bold text-4xl mb-5">PASSWORD</h1>
          </>
        );
      case "verify-reset":
        return (
          <>
            <h1 className="font-bold text-4xl mt-3">VERIFY</h1>
            <h1 className="text-[#F3B659] font-bold text-4xl mb-5">CODE</h1>
          </>
        );
      case "new-password":
        return (
          <>
            <h1 className="font-bold text-4xl mt-3">NEW</h1>
            <h1 className="text-[#F3B659] font-bold text-4xl mb-5">PASSWORD</h1>
          </>
        );
      default:
        return (
          <>
            <h1 className="font-bold text-4xl mt-3">LOGIN</h1>
            <h1 className="text-[#F3B659] font-bold text-4xl mb-5">ACCOUNT</h1>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">
        <main className="flex flex-col">
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={65}
          />

          {renderHeader()}

          {view === "login" && (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full text-[#767676]">
              <p>Enter your details to log in.</p>

              <div className="mt-5">
                <label className="tracking-[0.4em]">EMAIL ADDRESS</label>
                <Input
                  type="email"
                  placeholder="enter your email"
                  {...register("email", {
                    required: "Email required"
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="mt-3">
                <label className="tracking-[0.4em]">PASSWORD</label>
                <Input
                  type="password"
                  placeholder="enter your password"
                  {...register("password", {
                    required: "Password required"
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const emailVal = getValues("email");
                      if (emailVal) {
                        setResetEmail(emailVal);
                      }
                      setView("forgot");
                    }}
                    className="text-xs text-[#F3B659] hover:underline tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? "Logging in..." : "LOGIN"}
              </Button>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={handleRequestReset} className="w-full text-[#767676]">
              <p>Enter your email address to receive a password reset code.</p>

              <div className="mt-5">
                <label className="tracking-[0.4em]">EMAIL ADDRESS</label>
                <Input
                  type="email"
                  placeholder="enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "SEND RESET CODE"}
              </Button>

              <p className="text-center tracking-[0.4em] text-xs mt-4">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[#F3B659] hover:underline"
                >
                  BACK TO LOGIN
                </button>
              </p>
            </form>
          )}

          {view === "verify-reset" && (
            <form onSubmit={handleVerifyOtpCode} className="w-full text-[#767676]">
              <p>Enter the 6-digit code sent to your email.</p>

              <div className="mt-5">
                <label className="tracking-[0.4em]">RESET CODE (OTP)</label>
                <Input
                  type="text"
                  placeholder="enter 6-digit OTP"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                />
              </div>

              <Button type="submit">
                VERIFY CODE
              </Button>

              <p className="text-center tracking-[0.4em] text-xs mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRequestReset}
                  className="text-[#F3B659] hover:underline"
                >
                  RESEND CODE
                </button>
                <span className="text-[#767676]">|</span>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[#F3B659] hover:underline"
                >
                  BACK TO LOGIN
                </button>
              </p>
            </form>
          )}

          {view === "new-password" && (
            <form onSubmit={handleResetSubmit} className="w-full text-[#767676]">
              <p>Enter your new password and confirm it below.</p>

              <div className="mt-5">
                <label className="tracking-[0.4em]">NEW PASSWORD</label>
                <Input
                  type="password"
                  placeholder="enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mt-3">
                <label className="tracking-[0.4em]">CONFIRM PASSWORD</label>
                <Input
                  type="password"
                  placeholder="confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "RESET PASSWORD"}
              </Button>

              <p className="text-center tracking-[0.4em] text-xs mt-4">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[#F3B659] hover:underline"
                >
                  BACK TO LOGIN
                </button>
              </p>
            </form>
          )}

          {view === "login" && (
            <p className="text-center tracking-[0.4em] text-xs mt-5">
              NEW HERE?
              <Link
                href="/signup"
                className="text-[#F3B659] ml-1"
              >
                CREATE AN ACCOUNT
              </Link>
            </p>
          )}
        </main>
      </div>
    </div>
  );
}