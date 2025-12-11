import axios from "axios"

const URL = import.meta.env.VITE_API_URL


const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
})

class APIClient<ResponseType, RequestType = ResponseType> {
    endpoint: string

    constructor( endpoint: string) {
        this.endpoint = endpoint
    }
    
    get = (access?: string, params?: Record<string, string>) => {

        const config: any = {}
        if (params) {
            config.params = params
        }
        if (access) {
            config.headers = { ...config.headers, Authorization: `JWT ${access}` };
        }
    
        return axiosInstance
            .get<ResponseType>(this.endpoint, config)
            .then(res => res.data);
    }

    post = (data: RequestType | FormData, access?: string, params?: Record<string, string>) => {

        const config: any = {}
        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }

        // If data is FormData, let axios set Content-Type automatically (multipart/form-data)
        // Otherwise, keep the default JSON Content-Type
        if (data instanceof FormData) {
            // Don't set Content-Type header, let browser set it with boundary
            // axios will automatically handle FormData
        }

        if (params) {
            config.params = params
        }

        return axiosInstance
            .post<ResponseType>(this.endpoint, data, config)
            .then(res => res.data)            
    }

    update = (data: RequestType | FormData, access?: string, params?: Record<string, string>) => {

        const config: any = {}
        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }

        // If data is FormData, let axios set Content-Type automatically (multipart/form-data)
        // Otherwise, keep the default JSON Content-Type
        if (data instanceof FormData) {
            // Don't set Content-Type header, let browser set it with boundary
            // axios will automatically handle FormData
        }

        if (params) {
            config.params = params
        }

        return axiosInstance
            .patch<ResponseType>(this.endpoint, data, config)
            .then(res => res.data)
    }

    delete = (access?: string, params?: Record<string, string>) => {

        const config: any = {}

        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }

        if (params) {
            config.params = params
        }

        return axiosInstance
            .delete<ResponseType>(this.endpoint, config)
            .then(res => res.data)
    }
}

export default APIClient