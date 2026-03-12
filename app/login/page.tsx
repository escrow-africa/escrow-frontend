import Image from "next/image";
export default function Login(){
    return(
       <div className="min-h-screen flex items-center justify-center p-4">
             <div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">
               <main className="flex flex-col">
       
                 <Image src="/logo.png" alt="Logo" width={70} height={65} />
                 <h1 className="font-bold text-4xl mt-3">
                   LOGIN </h1>
                 <span className=" text-[#F3B659] font-bold text-4xl mb-5">ACCOUNT</span>
       
       
                 <form action="" className=" w-full text-[#767676]">
                   <p>Enter your details to log in.</p>
                
       
                   <div className="mt-5">
                     <label htmlFor="email" className="tracking-[0.4em]" >EMAIL ADDRESS</label>
                     <input
                       type="email"
                       placeholder="enter your email"
                       id="email"
                       className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
                     />
                   </div>
       
                   <div className="mt-3">
                     <label htmlFor="password" className="tracking-[0.4em]" >PASSWORD</label>
                     <input
                       type="password"
                       placeholder="enter your password"
                       id="password"
                       className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
                     />
                   </div>
       
                   <button className="btn w-full my-8 ">LOGIN</button>
       
       
                 </form>
                 <p className="text-center tracking-[0.4em] text-xs">NEW HERE? <a href="/signup" className="text-[#F3B659] ml-1"> CREATE AN ACCOUNT</a></p>
       
               </main>
             </div>
           </div>
    )
}