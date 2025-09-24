import { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios';
import axiosInstance from './axiosInstance';

const ApiService = {

    handleResponse: <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
        return promise
            .then((response: AxiosResponse<T>) => response.data)
            .catch((error: AxiosError) => {
                throw error;
            });
    },

    get: <T>(url: string, params?: unknown, headers?: AxiosRequestHeaders ): Promise<T> => {
        return ApiService.handleResponse(axiosInstance.get<T>(url, { params, headers }));
    },

    post: <T>(url: string, data?: unknown, headers?: AxiosRequestHeaders): Promise<T> => {
        return ApiService.handleResponse(axiosInstance.post<T>(url, data, { headers }));
    },

    put: <T>(url: string, data?: unknown, options?: { headers?: AxiosRequestHeaders, params?: unknown }): Promise<T> =>
        ApiService.handleResponse(axiosInstance.put<T>(url, data, options)),

    delete: <T>(url: string, headers?: AxiosRequestHeaders): Promise<T> =>
        ApiService.handleResponse(axiosInstance.delete<T>(url, { headers }))
};

export default ApiService;
