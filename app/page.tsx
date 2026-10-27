
import SelectRole from "@/components/SelectRole";
import Signup from "./(auth)/signup/page";
import ThemeToggle from "@/components/ThemeToggle";


export default function Home() {
  return (
    <div className=" ">
      <div className="pl-2 pt-2">
        <ThemeToggle />
      </div>
      <Signup />
      {/* <SelectRole /> */}
    </div>
  );
}
