"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type SignUpData from "@/components/Interface";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { extractFirstName } from "@/utils/user";

export default function Signup() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignUpData>();

  const createPassword = watch("createPassword");

  const onSubmit = async (data: SignUpData) => {
    try {
      if (typeof window !== "undefined") {
        // Clear any old session data
        localStorage.removeItem("user_fullName");
        localStorage.removeItem("user_avatarUrl");
        if (data.firstName) {
          const first = extractFirstName(data.firstName);
          localStorage.setItem("user_firstName", first);
        }
        if (data.firstName && data.lastName) {
          localStorage.setItem("user_fullName", `${data.firstName.trim()} ${data.lastName.trim()}`);
        }
        if (data.email) {
          localStorage.setItem("user_email", data.email.trim());
        }
      }

      await registerUser(data);
      toast.success("Your account was created successfully");
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

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
                <label htmlFor="firstName" className="tracking-[0.4em] text-xs" >FIRST NAME</label>
                <Input id="firstName" type="text"  {...register("firstName", {
                  required: "First name required"
                })} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="lastName" className="tracking-[0.4em] text-xs" >LAST NAME</label>
                <Input id="lastName" type="text"  {...register("lastName", {
                  required: "Last name required"
                })} />{errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="phone" className="tracking-[0.4em] text-xs" >PHONE</label>
              <Input id="phone" type="tel"   {...register("phone", {
                required: "WhatsApp phone number required"
              })} />{errors.phone && (
                <p className="text-red-500 text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="email" className="tracking-[0.4em] text-xs" >EMAIL</label>
              <Input id="email" type="email" {...register("email", {
                required: "Email required"
              })} />{errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label htmlFor="createPassword" className="tracking-[0.4em] text-xs" > CREATE PASSWORD</label>
              <Input id="createPassword" type="password"  {...register("createPassword", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters"
                }
              })} />{errors.createPassword && (
                <p className="text-red-500 text-sm">
                  {errors.createPassword.message}
                </p>
              )}

            </div>

            <div className="mt-3">
              <label htmlFor="confirmPassword" className="tracking-[0.4em] text-xs" >CONFIRM PASSWORD</label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === createPassword || "Passwords do not match"
              })} />{errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || loading}>{isSubmitting ? "Creating..." : "Create Profile"}</Button>


          </form>
          <p className="text-center tracking-[0.4em] text-xs">HAVE AN ACCOUNT? <Link href="/login">
            <span className="text-[#0B493A] font-bold text-xs">LOGIN</span>
          </Link>
          </p>

        </main>
      </div>
    </div>
  );
}