import Link from 'next/link'
import React from 'react'

const SelectRole = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
        <main className='border border-[#767676] rounded-2xl px-6 py-10 '>
<h1 className='text-[#F3B659] text-3xl text-center'>
SELECT ROLE
</h1>
<p className='text-[#767676] text-center'>Personalize your network interface</p>
<section className='flex gap-3 border border-[#767676] p-4 rounded-2xl '>
<div className='w-10'>
    <img src="/profile.png" alt="profile" />
</div>
<div>
    <h1 className=' text-[#F3B659] text-2xl' >BUYER</h1>
    <p className='text-[#767676]'>Create & fund escrows, confirm delivery and manage disputes</p>
</div>
</section>
<section className='flex gap-3 border border-[#767676] p-4 mt-6 rounded-2xl '>
<div className='w-10'>
    <img src="/profile.png" alt="profile" />
</div>
<div>
    <h1 className=' text-[#F3B659] text-2xl' >SELLER</h1>
    <p className='text-[#767676]'>Accept escrows, deliver services, and request fund releases</p>
</div>
</section>
<p className='text-[#767676] text-center text-xs my-5 tracking-[0.4em]'>Note: YOU CAN BE A BUYER OR A SELLER FOR ANY DEAL</p>
<div className=' text-center'>
<Link href="/dashboard" className='text-[#F3B659] text-xs' >SKIP & CONTINUE TO DASHBOARD</Link>
</div>

        </main>
      
    </div>
  )
}

export default SelectRole
