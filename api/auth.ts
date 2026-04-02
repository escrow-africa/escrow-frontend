import { api } from "./axios";

export const authApi = {

signup: async (payload:any) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
},

login: async (payload:any) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
},
requestOtp: async (data:any)=>{

const response = await api.post("/auth/request-otp",data);

return response.data;

},


verifyPassword: async (payload:any) => {
  const response = await api.post("/auth/verify-otp", payload);
  return response.data;
},

resetPassword: async (data:any)=>{

const response = await api.post("/auth/reset-password",data);

return response.data;

}
};