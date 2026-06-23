import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenCategoryService, { type KitchenCategory, type CreateKitchenCategory } from "../../../services/kitchen/categoryService"

interface CreateCategoryData {
    category: CreateKitchenCategory
    access: string
}

const useCreateKitchenCategory = (): UseMutationResult<KitchenCategory, Error, CreateCategoryData> => {
    const categoryService = getKitchenCategoryService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateCategoryData) => categoryService.post(data.category, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-categories'] })
        },
        onError: (error) => {
            console.error('Error creating kitchen category:', error)
        },
    })
}

export default useCreateKitchenCategory
