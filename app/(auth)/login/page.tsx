import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
export default function Login(){
    return(
       <div className="min-h-screen flex items-center justify-center p-4">
             <div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">
               <main className="flex flex-col">
       
                 <Image src="/logo.png" alt="Logo" width={70} height={65} />
                 <h1 className="font-bold text-4xl mt-3">
                   LOGIN </h1>
                 <h1 className=" text-[#F3B659] font-bold text-4xl mb-5">ACCOUNT</h1>
       
       
                 <form action="" className=" w-full text-[#767676]">
                   <p>Enter your details to log in.</p>
                
       
                   <div className="mt-5">
                     <label htmlFor="email" className="tracking-[0.4em]" >EMAIL ADDRESS</label>
                     <Input type="email" placeholder="enter your email"  />
                   </div>
       
                   <div className="mt-3">
                     <label htmlFor="password" className="tracking-[0.4em]" >PASSWORD</label>
                     <Input type="password" placeholder="enter your password"  />
                   </div>
       
                    <Button>LOGIN</Button>
       
       
                 </form>
                 <p className="text-center tracking-[0.4em] text-xs">NEW HERE? <a href="/signup" className="text-[#F3B659] ml-1"> CREATE AN ACCOUNT</a></p>
       
               </main>
             </div>
           </div>
    )
}