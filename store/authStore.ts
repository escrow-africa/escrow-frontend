import { create } from "zustand";
import { authApi } from "../api/auth";
import { setTokenCookie, removeTokenCookie } from "../utils/token";

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
        const token = response.accessToken || response.token;
        if (token) {
          setTokenCookie(token);
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
    }

    set({ loading:false, error:null });
  }
}));