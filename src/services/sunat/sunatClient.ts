import axios from "axios"

const URL = import.meta.env.VITE_TAXES_URL

const axiosInstance = axios.create({
    baseURL: URL,
})

class SunatClient<ResponseType, RequestType = ResponseType> {

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

    post = (data: RequestType, access?: string, params?: Record<string, string>) => {

        const config: any = {}
        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }

        if (params) {
            config.params = params
        }

        return axiosInstance
            .post<ResponseType>(this.endpoint, data, config)
            .then(res => res.data)   
    }
}

export default SunatClient