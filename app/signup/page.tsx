import Image from "next/image";
export default function Signup(){
    return(
        <div className=" w-144.5 mx-auto border items-center border-[#767676] rounded-2xl">
            <main className=" flex flex-col  justify-start grow py-10 px-10">
                
                    <Image src="/logo.png" alt="Logo" width={70} height={65}/>
                    <h1 className="font-bold text-4xl mt-3">
                       CREATE </h1>
                       <span className=" text-[#F3B659] font-bold text-4xl mb-5">PROFILE</span>
                    
                    
                    <form action="" className="w-124.5  text-[#767676]">
                        <p >Create your profile to start using the app.</p>
                        <div className="flex gap-40 items-center mt-3">
 <label htmlFor="full-name" className="mb-1">FULL NAME</label> 
                      <label htmlFor="phone" className="mb-1">PHONE</label>
                            
                        </div>
                        <input type="text"  placeholder="enter your name" id="full-name" className="w-61 border border-[#767676] rounded-md py-3 px-2 mr-2"/>
                        <input type="number" placeholder="enter your phone" id="phone" className="w-61 border border-[#767676] rounded-md py-3 px-2"/>
                     
                        <label htmlFor="email" className="mb-1 mt-5">EMAIL</label>
                        <div>
                           <input type="email" placeholder="enter your email" id="email" className="w-125 border border-[#767676] rounded-md py-3 px-2"/>
                 </div>
                  <label htmlFor="password" className="mb-1 mt-3">PASSWORD</label>
                        <div>
                           <input type="password" placeholder="enter your password" id="password" className="w-125 border border-[#767676] rounded-md py-3 px-2"/>
                 </div>
                      <div>
                        <button className="btn my-8  text-center block">CREATE PROFILE</button> 
                        </div>     
                      
                    </form>
                    <p className="text-center">HAVE AN ACCOUNT? <a href="/login"className="text-[#F3B659]">LOGIN</a></p>
                
            </main>
        </div>
    )
}