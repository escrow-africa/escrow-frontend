
import SelectRole from "@/components/SelectRole";
import Signup from "./signup/page";
import ThemeToggle from "@/components/ThemeToggle";


export default function Home() {
  return (
    <div className="bg-black text-white ">
      <div className="pl-2 pt-2">
        <ThemeToggle />
      </div>
       <Signup /> 
      {/* <SelectRole /> */}
    </div>
  );
}
