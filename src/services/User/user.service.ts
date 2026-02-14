import { get, post } from "@/utils/api";
import { ApiResponse } from "@/models/AuthResponse";

export async function getUserInformation<T>(jwt: string): Promise<ApiResponse<T>> {
    console.log("Hitting me endpoint");
    return await get<T>('/user/user-information', jwt);
}


