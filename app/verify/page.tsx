"use client"
import { OTPInput } from "input-otp";
import Image from "next/image";

export default function page() {


return (
  <div className=" min-h-screen flex items-center justify-center">
    <div className="p-8 border border-[#767676] rounded-2xl text-center ">
      <div className="flex items-center justify-center">
        <Image src="/bell.png" alt="Logo" width={50} height={50} />
      </div>
      <div className="flex  justify-center my-3">
        <h1 className="  font-bold text-4xl">VERIFY</h1>
        <span className=" text-[#F3B659] font-bold text-4xl ">ACCESS</span>
      </div>
      <p className="text-[#767676] text-xs w-3/4  mx-auto pb-4">We sent a 6-digit code to your phone or email.</p>
      <form action="">
        <div>
          <OTPInput
            maxLength={6}
            render={({ slots }) => (
              <div className="flex gap-2 justify-center">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`relative w-14 h-14 rounded-lg border flex items-center justify-center text-xl font-bold transition-all ${slot.isActive ? 'border-[#F3B659] ring-1 ring-[#F3B659]' : 'border-[#767676]'
                      } bg-black text-white`}
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


        <button className="btn w-full my-6">
          VERIFY CODE

        </button>
      </form>
      <p className="text-[#767676] text-xs tracking-[0.4em]">RESEND CODE</p>

    </div>
  </div>
)
}
