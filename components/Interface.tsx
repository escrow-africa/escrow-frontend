export default interface SignUpData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  createPassword: string;
  confirmPassword: string;
}
export interface LoginData{

email:string;
password:string;

}
export interface VerifyOtpData{

email:string | null;
otp:string;

}

export interface RequestOtpData{

email:string | null;

}