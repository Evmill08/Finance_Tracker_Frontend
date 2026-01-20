import { post } from "@/utils/api";
import { ApiResponse } from "@/models/AuthResponse";
import * as SecureStore from 'expo-secure-store';

// Gets basic information for the user
export async function getUserInformation<T>(jwt: string): Promise<ApiResponse<T>> {
    console.log("Hitting me endpoint");
    return await post<T>('/user-information', {jwt});
}
