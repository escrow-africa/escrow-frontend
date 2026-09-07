"use client";

import Button from "@/components/Button";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SuccessModal from "@/components/SuccessModal";
import { useAuthStore } from "@/store/authStore";

export default function VerifyPage() {
    const [otp, setOtp] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const verifyOtp = useAuthStore((state) => state.verifyOtp);
    const requestOtp = useAuthStore((state) => state.requestOtp);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            return toast.error("Enter valid 6-digit OTP");
        }

        setIsLoading(true);
        try {
            await verifyOtp({
                email,
                otp: Number(otp),
            });
            toast.success("Verification successful");
            setShowSuccessModal(true);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Invalid OTP"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            await requestOtp({ email });
            toast.success("OTP resent");
        } catch {
            toast.error("Failed to resend");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="p-6 sm:p-8 w-full max-w-md border border-[#E4E3E3CC] rounded-2xl text-center">
                <div className="flex items-center justify-center bg-[#0B493A]/15 rounded-full w-16 h-16 mx-auto border border-[#0B493A]/40">
                    <Image
                        src="/bell2.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="animate-swing"
                    />
                </div>

                <div className="flex gap-2 justify-center my-3">
                    <h1 className="font-bold text-3xl sm:text-4xl text-[#0B493A]">
                        VERIFY ACCESS
                    </h1>
                </div>

                <p className="text-[#767676] font-semibold w-[90%] sm:w-3/4 mx-auto pb-4">
                    We sent a 6-digit code to your phone or email.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="w-full my-2">
                        <OTPInput
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            pattern={REGEXP_ONLY_DIGITS}
                            autoFocus
                            containerClassName="flex items-center justify-center"
                            render={({ slots }) => (
                                <div className="flex gap-2 sm:gap-2.5 justify-center">
                                    {slots.map((slot, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative w-10 h-12 sm:w-13 sm:h-14 rounded-lg border flex items-center justify-center text-lg sm:text-xl font-bold bg-[#E4E3E3CC] text-[#0B493A] transition-all ${
                                                slot.isActive
                                                    ? 'border-[#F3B659] ring-2 ring-[#F3B659]'
                                                    : 'border-[#E4E3E3CC]'
                                            }`}
                                        >
                                            {slot.char !== null ? slot.char : ""}
                                            {slot.hasFakeCaret && (
                                                <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
                                                    <div className="w-0.5 h-6 bg-[#0B493A]" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? "Verifying..." : "Verify Now"}
                    </Button>
                </form>

                <p
                    onClick={resendOtp}
                    className="text-[#0B493A] hover:text-[#F3B659] text-xs tracking-[0.4em] cursor-pointer mt-3"
                >
                    RESEND CODE
                </p>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    router.push("/login");
                }}
            />
        </div>
    );
}
