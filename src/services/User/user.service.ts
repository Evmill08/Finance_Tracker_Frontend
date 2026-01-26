import { get, post } from "@/utils/api";
import { ApiResponse } from "@/models/AuthResponse";
import * as SecureStore from 'expo-secure-store';

// TODO: Make sure this includes the token in the request
// Make sure our backend is accepting this
export async function getUserInformation<T>(jwt: string): Promise<ApiResponse<T>> {
    console.log("Hitting me endpoint");
    return await get<T>('/user/user-information', jwt);
}

export async function getLinkToken<T>(jwt: string): Promise<ApiResponse<T>> {
    return await get<T>('/users/create-link-token', jwt);
}

export async function exchangeToken<T>(linkToken: string, jwt: string): Promise<ApiResponse<T>> {
    return await post<T>('/users/exchange', linkToken, jwt);
}
