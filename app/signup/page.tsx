import Image from "next/image";
export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-[#767676] rounded-2xl p-6 sm:p-10">
        <main className="flex flex-col">

          <Image src="/logo.png" alt="Logo" width={70} height={65} />
          <h1 className="font-bold text-4xl mt-3">
            CREATE </h1>
          <span className=" text-[#F3B659] font-bold text-4xl mb-5">PROFILE</span>


          <form action="" className=" w-full text-[#767676]">
            <p >Create your profile to start using the app.</p>
            <div className="flex gap-4 mt-3">
              <div className="w-full">
                <label htmlFor="full-name">FULL NAME</label>
                <input
                  type="text"
                  placeholder="enter your name"
                  id="full-name"
                  className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
                />
              </div>

              <div className="w-full">
                <label htmlFor="phone">PHONE</label>
                <input
                  type="number"
                  placeholder="enter your phone"
                  id="phone"
                  className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="email">EMAIL</label>
              <input
                type="email"
                placeholder="enter your email"
                id="email"
                className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                placeholder="enter your password"
                id="password"
                className="w-full border border-[#767676] rounded-md py-3 px-2 mt-1"
              />
            </div>

            <button className="btn w-full my-8 ">CREATE PROFILE</button>


          </form>
          <p className="text-center">HAVE AN ACCOUNT? <a href="/login" className="text-[#F3B659] ml-1">LOGIN</a></p>

        </main>
      </div>
    </div>
  );
}