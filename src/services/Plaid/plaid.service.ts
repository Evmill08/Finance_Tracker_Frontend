import {get, post} from "@/utils/api";
import {ApiResponse} from "@/models/AuthResponse";

export async function getLinkToken<T>(jwt: string): Promise<ApiResponse<T>> {
    return await get<T>('/plaid/create-link-token', jwt);
}

export async function exchangeToken<T>(publicToken: string, jwt: string): Promise<ApiResponse<T>> {
    return await post<T>('/plaid/exchange', {"token": publicToken}, jwt);
}