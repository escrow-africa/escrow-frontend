import { create } from "zustand";
import { authApi } from "../api/auth";

interface AuthState{

loading:boolean;
error:string | null;

register:(data:any)=>Promise<void>;
login:(data:any)=>Promise<void>;
requestOtp:(data:any)=>Promise<void>;
verifyOtp:(data:any)=>Promise<void>;
resetPassword:(data:any)=>Promise<void>;

}

export const useAuthStore = create<AuthState>((set)=>({

loading:false,
error:null,

register: async(data)=>{

set({loading:true,error:null});

try{

await authApi.signup(data);

set({loading:false});

}catch(error:any){

set({

error:error.response?.data?.message,
loading:false

});

}

},

login: async(data)=>{

set({loading:true,error:null});

try{

const response = await authApi.login(data);

localStorage.setItem("token",response.token);

set({loading:false});

}catch(error:any){

set({

error:error.response?.data?.message,
loading:false

});

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

}));