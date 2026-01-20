import { ApiResponse } from "@/models/AuthResponse";
import {BASE_URL} from "config";

export async function post<T>(
    path: string,
    body: any,
    token?: string
) : Promise<ApiResponse<T>> {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token){
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log("Hitting: ", `${BASE_URL}${path}`);
    console.log("with body: ", JSON.stringify(body));
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    console.log("response from post: ", JSON.stringify(response));

    if (!response.ok){
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return await response.json()
}