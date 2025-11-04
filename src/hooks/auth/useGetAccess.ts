import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import accessService, { type AccessRequest, type AccessResponse } from "../../services/auth/accessService"
import useAuthStore from "../../store/useAuthStore"

const useGetAccess = (): UseMutationResult<AccessResponse, Error, AccessRequest> => {
    const setTokens = useAuthStore((state) => state.setTokens)
    return useMutation({
        mutationFn: (data: AccessRequest) => accessService.post(data),
        onSuccess: (data) => {
            console.log("Access data", data)
            setTokens(data.access, data.refresh)
        },
        onError: (error) => {
            console.log("Error", error)
        }
    })
}

export default useGetAccess