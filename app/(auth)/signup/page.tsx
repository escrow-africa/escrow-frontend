"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type SignUpData from "@/components/Interface";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Signup() {
  const router = useRouter()
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpData>();

  const onSubmit = async (data: SignUpData) => {
    try {
      await registerUser(data);
      router.push(`/verify?email=${data.email}`);
    } catch {
      toast.error("Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-[#E4E3E3CC] rounded-2xl p-6 sm:p-10">
        <main className="flex flex-col">

          <Image src="/logo.png" alt="Logo" width={70} height={65} />
          <h1 className="font-bold text-4xl mt-3  text-[#0B493A]">
            CREATE </h1>
            <h1 className="font-bold text-4xl text-[#0B493A]"> PROFILE</h1>

          <form onSubmit={handleSubmit(onSubmit)} className=" w-full text-[#686767]">
            <p className="font-semibold">Create your profile to start using the app.</p>
            <div className="flex gap-4 mt-7">
              <div className="w-full">
                <label htmlFor="fullName" className="tracking-[0.4em]" >FULL NAME</label>
                <Input type="text" placeholder="enter your full name" {...register("fullName", {
                  required: "Full name required"
                })} />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="phone" className="tracking-[0.4em]" >PHONE</label>
                <Input type="tel" placeholder="enter whatsapp number"  {...register("phone", {
                  required: "WhatsApp phone number required"
                })} />{errors.phone && (
                  <p className="text-red-500 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

    

            <div className="mt-5">
              <label htmlFor="email" className="tracking-[0.4em]" >EMAIL</label>
              <Input type="email" placeholder="enter your email" {...register("email", {
                required: "Email required"
              })} />{errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label htmlFor="password" className="tracking-[0.4em]">PASSWORD</label>
              <Input type="password" placeholder="enter your password" {...register("password", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters"
                }
              })} />{errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

            </div>

            <Button type="submit" disabled={isSubmitting || loading}>{isSubmitting ? "Creating..." : "Create Profile"}</Button>


          </form>
          <p className="text-center tracking-[0.4em] text-xs">HAVE AN ACCOUNT? <Link href="/login">
            <span className="text-[#0B493A] font-bold">LOGIN</span>
          </Link>
          </p>

        </main>
      </div>
    </div>
  );
}