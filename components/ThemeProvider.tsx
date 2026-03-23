"use client"
import { createContext, useState, ReactNode, Children } from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }){
    const [theme, setTheme]=useState("dark")

    const toggleTheme=()=>{
setTheme((curr)=>(curr==='dark' ? 'light' : 'dark'))
    }

    return(

 <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "light" ? "light" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
    )
}