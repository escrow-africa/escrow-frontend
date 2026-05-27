// "use client"
// import Button from "@/components/Button";
// import { OTPInput } from "input-otp";
// import Image from "next/image";

// export default function page() {


// return (
//   <div className="min-h-screen flex items-center justify-center px-4">
//     <div className="p-6 sm:p-8 w-full max-w-md border border-[#767676] rounded-2xl text-center">
//       <div className="flex items-center justify-center">
//         <Image src="/bell.png" alt="Logo" width={50} height={50} />
//       </div>
//       <div className="flex gap-2 justify-center my-3">
//         <h1 className="font-bold text-3xl sm:text-4xl">VERIFY</h1>
//         <span className="text-[#F3B659] font-bold text-3xl sm:text-4xl">ACCESS</span>
//       </div>
//       <p className="text-[#767676] text-xs w-[90%] sm:w-3/4 mx-auto pb-4">We sent a 6-digit code to your phone or email.</p>
//       <form action="">
//         <div className="w-full">
//           <OTPInput
//             maxLength={6}
//             render={({ slots }) => (
//               <div className="flex gap-1 sm:gap-2 justify-center">
//                 {slots.map((slot, idx) => (
//                   <div
//                     key={idx}
//                     className={`relative w-9 h-12 sm:w-14 sm:h-14 rounded-lg border flex items-center justify-center text-lg sm:text-xl font-bold transition-all ${slot.isActive ? 'border-[#F3B659] ring-1 ring-[#F3B659]' : 'border-[#767676]'
//                       } bg-black text-white`}
//                   >
//                     {slot.char !== null ? slot.char : ""}
//                     {slot.hasFakeCaret && (
//                       <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
//                         <div className="w-px h-6 bg-white" />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           />
//         </div>

// <Button type="submit">VERIFY CODE</Button>
//       </form>
//       <p className="text-[#767676] text-xs tracking-[0.4em]">RESEND CODE</p>

//     </div>
//   </div>
// )
// }
"use client";

import Button from "@/components/Button";
import { OTPInput } from "input-otp";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SuccessModal from "@/components/SuccessModal";
import { useAuthStore } from "@/store/authStore";

export default function VerifyPage() {

    const [otp, setOtp] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    const verifyOtp = useAuthStore((state) => state.verifyOtp);
    const requestOtp = useAuthStore((state) => state.requestOtp);
    const loading = useAuthStore((state) => state.loading);


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (otp.length !== 6) {

            toast.error("Enter valid OTP");

            return;

        }

        try {

            await verifyOtp({
                email,
                otp: otp
            });

            toast.success("Verification successful");

            setShowSuccessModal(true);

        } catch (error: any) {

            toast.error(
                error?.response?.data?.message || "Invalid OTP"
            );

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

                <div className="flex items-center justify-center  bg-[#0B493A]/15 rounded-full w-16 h-16 mx-auto border border-[#0B493A]/40">

                    <Image
                        src="/bell2.png"
                        alt="Logo"
                        width={50}
                        height={50}
                    />

                </div>


                <div className="flex gap-2 justify-center my-3">

                    <h1 className="font-bold text-3xl sm:text-4xl text-[#0B493A]">
                        VERIFY ACCESS
                    </h1>

        

                </div>


                <p className="text-[#767676] font-semibold  w-[90%] sm:w-3/4 mx-auto pb-4">

                    We sent a 6-digit code to your phone or email.

                </p>


                <form onSubmit={handleSubmit}>

                    <div className="w-full">

                        <OTPInput

                            maxLength={6}

                            value={otp}

                            onChange={(value) => setOtp(value)}

                            render={({ slots }) => (

                                <div className="flex gap-1 sm:gap-2 justify-center">

                                    {slots.map((slot, idx) => (

                                        <div

                                            key={idx}

                                            className={`relative w-9 h-12 sm:w-14 sm:h-14 rounded-lg border flex items-center justify-center text-lg sm:text-xl  transition-all 

${slot.isActive

                                                    ? 'border-[#F3B659] ring-1 ring-[#F3B659]'

                                                    : 'border-[#E4E3E3CC]'}`}

                                        >

                                            {slot.char !== null ? slot.char : ""}

                                            {slot.hasFakeCaret && (

                                                <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">

                                                    <div className="w-px h-6 bg-white" />

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
                        disabled={loading}
                    >

                        {loading ? "Verifying..." : "Verify Now"}

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
                    router.push("/dashboard");
                }}
            />

        </div>

    );

}
