import AuthClient from "./authClient"

export interface AccessResponse {
    access: string
    refresh: string
}

export interface AccessRequest {
    username: string
    password: string
}

const accessService = new AuthClient<AccessResponse, AccessRequest>("/jwt/create/")

export default accessService