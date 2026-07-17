import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import accessService, { type AccessRequest, type AccessResponse } from "../../services/auth/accessService"
import useAuthStore from "../../store/useAuthStore"

const useGetAccess = (): UseMutationResult<AccessResponse, Error, AccessRequest> => {
    const setTokens = useAuthStore((state) => state.setTokens)
    return useMutation({
        mutationFn: (data: AccessRequest) => accessService.post(data),
        onSuccess: (data, variables) => {
            setTokens(data.access, data.refresh, variables.username)
        },
        onError: (error) => {
            console.log("Error", error)
        }
    })
}

export default useGetAccess