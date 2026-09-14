import { create } from "zustand";
import { authApi } from "../api/auth";
import { setTokenCookie, removeTokenCookie } from "../utils/token";
import { extractFirstName } from "../utils/user";

interface AuthState{

loading:boolean;
error:string | null;

register:(data:any)=>Promise<void>;
login:(data:any)=>Promise<void>;
requestOtp:(data:any)=>Promise<void>;
verifyOtp:(data:any)=>Promise<void>;
resetPassword:(data:any)=>Promise<void>;
	logout:()=>void;

}

export const useAuthStore = create<AuthState>((set)=>({
  loading:false,
  error:null,

  register: async(data)=>{
    set({ loading:true, error:null });

    try{
      const response = await authApi.signup(data);
      set({loading:false});
      return response;
    } catch(error:any) {
      set({
        error:error.response?.data?.message,
        loading:false,
      });

      throw error;
    }
  },

  login: async(data) => {
    set({loading:true,error:null});

    try {
      const response = await authApi.login(data);

      if (typeof window !== "undefined" && response) {
        // Clear previous user session
        localStorage.removeItem("user_fullName");
        localStorage.removeItem("user_firstName");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_avatarUrl");
        localStorage.removeItem("user_bio");

        const token = response.accessToken || response.token;
        if (token) {
          setTokenCookie(token);

          // Extract identity from token if available
          try {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));
            const tokenFirst = extractFirstName(
              decoded.firstName || decoded.first_name || decoded.fullName || decoded.name || ""
            );
            if (tokenFirst) localStorage.setItem("user_firstName", tokenFirst);
            if (decoded.email) localStorage.setItem("user_email", decoded.email);
          } catch {}
        }

        const user = response.user || response.data?.user || response.data;
        if (user) {
          const first = extractFirstName(user);
          if (first) localStorage.setItem("user_firstName", first);
          const full = user.fullName || user.name || `${user.firstName || first} ${user.lastName || ""}`.trim();
          if (full) localStorage.setItem("user_fullName", full);
          if (user.email) localStorage.setItem("user_email", user.email);
        } else if (data.email) {
          localStorage.setItem("user_email", data.email);
        }
      }

      set({loading:false});
      return response;
    } catch(error:any) {
      set({
        error:error.response?.data?.message,
        loading:false,
      });

      throw error;
    }
  },

  requestOtp: async(data)=>{
    set({ loading: true, error: null });
    try {
      await authApi.requestOtp(data);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to request OTP",
        loading: false
      });
      throw error;
    }
  },

  verifyOtp: async(data)=>{
    set({ loading: true, error: null });
    try {
      const response = await authApi.verifyEmail(data);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Invalid OTP",
        loading: false
      });
      throw error;
    }
  },

  resetPassword: async(data)=>{
    set({ loading: true, error: null });
    try {
      const response = await authApi.resetPassword(data);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to reset password",
        loading: false
      });
      throw error;
    }
  },
  
  logout: () => {
    if (typeof window !== "undefined") {
      removeTokenCookie();
      localStorage.removeItem("user_fullName");
      localStorage.removeItem("user_firstName");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_avatarUrl");
      localStorage.removeItem("user_bio");
    }

    set({ loading:false, error:null });
  }
}));