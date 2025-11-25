import axios from "axios"

const URL = import.meta.env.VITE_SUNAT_URL

const axiosInstance = axios.create({
    baseURL: URL,
})

class SunatClient<ResponseType> {
    endpoint: string
    personaId?: string
    personaToken?: string

    constructor( endpoint: string, personaId?: string, personaToken?: string) {
        this.endpoint = endpoint
        this.personaId = personaId
        this.personaToken = personaToken
    }
    
    get = () => {
        const config: any = {}
        
        // Add query parameters if provided
        if (this.personaId && this.personaToken) {
            config.params = {
                personaId: this.personaId,
                personaToken: this.personaToken
            }
        }
        
        return axiosInstance
            .get<ResponseType>(this.endpoint, config)
            .then(res => res.data);
    }
}

export default SunatClient