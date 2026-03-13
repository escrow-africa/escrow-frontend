import Image from "next/image";
export default function page(){
    return(
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
                    <button className="btn w-full my-6">
                        VERIFY CODE

                    </button>
                </form>
                <p className="text-[#767676] text-xs tracking-[0.4em]">RESEND CODE</p>

             </div>
        </div>
    )
}