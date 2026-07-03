import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenCategoryService, { type KitchenCategory, type CreateKitchenCategory } from "../../../services/kitchen/categoryService"
import { getKitchenErrorMessage } from '../../../utils/kitchenErrorHelpers'

interface CreateCategoryData {
    category: CreateKitchenCategory
    access: string
}

const useCreateKitchenCategory = (): UseMutationResult<KitchenCategory, Error, CreateCategoryData> => {
    const categoryService = getKitchenCategoryService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateCategoryData) => {
            try {
                return await categoryService.post(data.category, data.access)
            } catch (error) {
                throw new Error(getKitchenErrorMessage(error, 'Error al crear la categoría'))
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-categories'] })
        },
        onError: (error) => {
            console.error('Error creating kitchen category:', error)
        },
    })
}

export default useCreateKitchenCategory
