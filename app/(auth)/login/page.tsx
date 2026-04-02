// import Button from "@/components/Button";
// import Input from "@/components/Input";
// import Image from "next/image";
// export default function Login(){
//     return(
//        <div className="min-h-screen flex items-center justify-center p-4">
//              <div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">
//                <main className="flex flex-col">
       
//                  <Image src="/logo.png" alt="Logo" width={70} height={65} />
//                  <h1 className="font-bold text-4xl mt-3">
//                    LOGIN </h1>
//                  <h1 className=" text-[#F3B659] font-bold text-4xl mb-5">ACCOUNT</h1>
       
       
//                  <form action="" className=" w-full text-[#767676]">
//                    <p>Enter your details to log in.</p>
                
       
//                    <div className="mt-5">
//                      <label htmlFor="email" className="tracking-[0.4em]" >EMAIL ADDRESS</label>
//                      <Input type="email" placeholder="enter your email"  />
//                    </div>
       
//                    <div className="mt-3">
//                      <label htmlFor="password" className="tracking-[0.4em]" >PASSWORD</label>
//                      <Input type="password" placeholder="enter your password"  />
//                    </div>
       
//                     <Button>LOGIN</Button>
       
       
//                  </form>
//                  <p className="text-center tracking-[0.4em] text-xs">NEW HERE? <a href="/signup" className="text-[#F3B659] ml-1"> CREATE AN ACCOUNT</a></p>
       
//                </main>
//              </div>
//            </div>
//     )
// }

"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import type { LoginData } from "@/components/Interface";

export default function Login(){

const router = useRouter();

const loginUser = useAuthStore((state)=>state.login);
const loading = useAuthStore((state)=>state.loading);

const {

register,
handleSubmit,
formState:{errors,isSubmitting}

} = useForm<LoginData>();


const onSubmit = async (data:LoginData)=>{

try{

await loginUser(data);

toast.success("Login successful");

router.push("/dashboard"); 

}catch(error:any){

toast.error(
error?.response?.data?.message || "Login failed"
);

}

};


return(

<div className="min-h-screen flex items-center justify-center p-4">

<div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">

<main className="flex flex-col">

<Image 
src="/logo.png" 
alt="Logo" 
width={70} 
height={65} 
/>

<h1 className="font-bold text-4xl mt-3">
LOGIN
</h1>

<h1 className=" text-[#F3B659] font-bold text-4xl mb-5">
ACCOUNT
</h1>


<form 
onSubmit={handleSubmit(onSubmit)} 
className=" w-full text-[#767676]"
>

<p>
Enter your details to log in.
</p>


<div className="mt-5">

<label className="tracking-[0.4em]">
EMAIL ADDRESS
</label>

<Input
type="email"
placeholder="enter your email"

{...register("email",{
required:"Email required"
})}
/>

{errors.email && (

<p className="text-red-500 text-sm">
{errors.email.message}
</p>

)}

</div>


<div className="mt-3">

<label className="tracking-[0.4em]">
PASSWORD
</label>

<Input
type="password"
placeholder="enter your password"

{...register("password",{
required:"Password required"
})}
/>

{errors.password && (

<p className="text-red-500 text-sm">
{errors.password.message}
</p>

)}

</div>


<Button
type="submit"
disabled={isSubmitting || loading}
>

{isSubmitting || loading ? "Logging in..." : "LOGIN"}

</Button>

</form>


<p className="text-center tracking-[0.4em] text-xs">

NEW HERE?

<Link 
href="/signup" 
className="text-[#F3B659] ml-1"
>
CREATE AN ACCOUNT
</Link>

</p>

</main>

</div>

</div>

);

}