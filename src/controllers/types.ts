export interface IResponseData<T> {
	message?: string | null;
	code: number;
	data?: T;
}

export interface IErrorResponse {
    code: number;
    message: string;
}