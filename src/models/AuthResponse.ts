export interface AuthApiResponse<T>{
    success: boolean;
    data: T;
    errorMessage?: string;
}

