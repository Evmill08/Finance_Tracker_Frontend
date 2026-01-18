import { post } from "./api";
import { AuthApiResponse} from "@/models/AuthResponse";

// TODO: not sure if I love the abstraction type here
export async function login(email: string, password: string): Promise<AuthApiResponse<any>>{
    console.log("Hit login function")
    return post<AuthApiResponse<any>>('/auth/login', {email, password});
}

export async function signup(email: string, password: string): Promise<AuthApiResponse<any>>{
    return post<AuthApiResponse<any>>('/auth/signup', {email, password});
}

export async function verifyEmail(email: string, verificationCode: string): Promise<AuthApiResponse<any>> {
    console.log("hit verify email")
    return post<AuthApiResponse<any>>('/auth/verify-email', {email, verificationCode});
}

export async function resendVerificationEmail(verificationToken: string) {
    return post<AuthApiResponse<any>>('/auth/resend-verification', {verificationToken});
}