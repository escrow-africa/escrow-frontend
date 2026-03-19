export const registerUser = async (data:any)=>{

 return new Promise((resolve)=>{

  setTimeout(()=>{

   resolve({
    message:"Account created"
   })

  },1000)

 })

}


// import { api } from "./axios";

// export const registerUser = async (data:any)=>{

//  const response = await api.post(
//   "/auth/register",
//   data
//  );

//  return response.data;
// }