import { post } from "../../utils/api";
import { ApiResponse } from "@/models/AuthResponse";

// TODO: not sure if I love the abstraction type here
export async function login<T>(email: string, password: string): Promise<ApiResponse<T>>{
    console.log("Hit login function")
    return post<T>('/auth/login', {email, password});
}

export async function signup<T>(email: string, password: string, firstName: string, lastName: string): Promise<ApiResponse<T>>{
    return post<T>('/auth/signup', {email, password, firstName, lastName});
}

export async function verifyEmail<T>(email: string, verificationCode: string): Promise<ApiResponse<T>> {
    console.log("hit verify email")
    return post<T>('/auth/verify-email', {email, verificationCode});
}

// TODO: This needs to be fleshed out/thought about
export async function resendVerificationEmail<T>(verificationToken: string) {
    return post<T>('/auth/resend-verification', {verificationToken});
}

export async function requestPasswordReset<T>(email: string){
    return post<T>('/auth/request-password-reset', {email});
}

export async function confirmPaswordReset<T>(email: string, verificationCode: string, newPassword: string){
    return post<T>('/auth/confirm-password-reset', {email, verificationCode, newPassword});
}