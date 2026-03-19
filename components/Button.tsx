
interface ButtonProps {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
}
export default function Button({ children, type }: ButtonProps) {
  return (
    <button type={type} className=" w-full  bg-[#F3B659] text-black px-5 py-3 my-4 rounded-lg hover:bg-[#F3B659]/90 transition-colors">
      {children}
    </button>
  )
}