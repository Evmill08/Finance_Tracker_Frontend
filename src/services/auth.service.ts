import { post } from "./api";
import { AuthResponse} from "@/models/AuthResponse";

export async function login(email: string, password: string): Promise<AuthResponse>{
    return post<AuthResponse>('/auth/login', {email, password});
}

export async function signup(email: string, password: string): Promise<AuthResponse>{
    return post<AuthResponse>('/auth/signup', {email, password});
}