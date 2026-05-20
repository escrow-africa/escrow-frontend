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

set({loading:true,error:null});

try{

const response = await authApi.signup(data);

			if (typeof window !== "undefined" && response) {
				const token = response.accessToken || response.token;
				if (token) setTokenCookie(token);
				if (data.fullName) {
					localStorage.setItem("user_fullName", data.fullName);
				}
			}

set({loading:false});

}catch(error:any){

set({

error:error.response?.data?.message,
loading:false

});
throw error;

}

},

login: async(data)=>{

set({loading:true,error:null});

try{


const response = await authApi.login(data);

			if (typeof window !== "undefined" && response) {
				const token = response.accessToken || response.token;
				if (token) setTokenCookie(token);
				
				const user = response.user || response.data?.user;
				const fullName = user?.fullName || user?.name || response.fullName || response.name;
				if (fullName) {
					localStorage.setItem("user_fullName", fullName);
				}
			}

set({loading:false});

}catch(error:any){

set({

error:error.response?.data?.message,
loading:false

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
    const response = await authApi.verifyPassword(data);
    if (typeof window !== "undefined" && response) {
      const token = response.accessToken || response.token;
      if (token) setTokenCookie(token);
    }
    set({ loading: false });
  } catch (error: any) {
    set({
      error: error.response?.data?.message || "Invalid OTP",
      loading: false
    });
    throw error;
  }
},

resetPassword: async(data)=>{

await authApi.resetPassword(data);

}

 ,logout: ()=>{

		if (typeof window !== "undefined") {
			removeTokenCookie();
			localStorage.removeItem("user_fullName");
		}

		set({ loading:false, error:null });

	}

}));