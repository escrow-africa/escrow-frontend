
interface ButtonProps {
  children: React.ReactNode;
}
export default function Button({ children }: ButtonProps) {
  return (
    <button className=" w-full  bg-[#F3B659] text-black px-5 py-3 my-4 rounded-lg hover:bg-[#F3B659]/90 transition-colors">
      {children}
    </button>
  )
}