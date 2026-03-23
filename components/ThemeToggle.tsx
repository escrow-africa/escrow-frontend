"use client"

import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle(){

const themeContext = useContext(ThemeContext);

if(!themeContext) return null;

const { theme, toggleTheme } = themeContext;

return(

<button
onClick={toggleTheme}
className="
relative flex items-center
w-16 h-8 rounded-full
bg-(--card)
border border-(--input-border)
transition
"
>

{/* sliding circle */}
<div
className={`
absolute w-6 h-6 rounded-full
bg-(--button-bg)
transition-all duration-300
flex items-center justify-center
${theme === "dark" ? "translate-x-8" : "translate-x-1"}
`}
>
{theme === "dark" ? 
<Moon size={14}/> : 
<Sun size={14}/>
}

</div>

</button>

)
}