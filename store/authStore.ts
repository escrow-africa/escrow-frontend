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

await authApi.requestOtp(data);

},

verifyOtp: async(data)=>{

await authApi.verifyPassword(data);

},

resetPassword: async(data)=>{

await authApi.resetPassword(data);

}

 ,logout: ()=>{

		if (typeof window !== "undefined") {
			removeTokenCookie();
		}

		set({ loading:false, error:null });

	}

}));