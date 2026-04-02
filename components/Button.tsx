
interface ButtonProps {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
}
export default function Button({ children, type, disabled }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-[#F3B659] text-black px-5 py-3 my-4 rounded-lg hover:bg-[#F3B659]/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}