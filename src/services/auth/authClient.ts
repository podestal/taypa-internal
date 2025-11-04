import axios from "axios"

const URL = import.meta.env.VITE_AUTH_URL;

const axiosInstance = axios.create({
    baseURL: URL, 
});

class AuthClient<ResponseType, RequestType = ResponseType> {
    endpoint: string

    constructor(endpoint: string) {
        this.endpoint = endpoint; 
    }

    get = (access: string) => {
        return axiosInstance
            .get<ResponseType>(this.endpoint, {
                headers: { Authorization: `JWT ${access}` }, 
            })
            .then(res => res.data); 
    }

    post = (data: RequestType) => {
        return axiosInstance
            .post<ResponseType>(this.endpoint, data)
            .then(res => res.data)
    }
}

export default AuthClient