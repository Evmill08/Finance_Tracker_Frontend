import { get } from "@/utils/api";
import { ApiResponse } from "@/models/AuthResponse";
import * as SecureStore from 'expo-secure-store';

// TODO: Make sure this includes the token in the request
// Make sure our backend is accepting this
export async function getUserInformation<T>(jwt: string): Promise<ApiResponse<T>> {
    console.log("Hitting me endpoint");
    return await get<T>('/user/user-information', jwt);
}
