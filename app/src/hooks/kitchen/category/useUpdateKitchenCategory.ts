import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenCategoryService, { type KitchenCategory, type UpdateKitchenCategory } from "../../../services/kitchen/categoryService"

interface UpdateCategoryData {
    category: UpdateKitchenCategory
    access: string
}

interface Props {
    categoryId: number
}

const useUpdateKitchenCategory = ({ categoryId }: Props): UseMutationResult<KitchenCategory, Error, UpdateCategoryData> => {
    const categoryService = getKitchenCategoryService({ categoryId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateCategoryData) => categoryService.update(data.category, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-categories'] })
        },
        onError: (error) => {
            console.error('Error updating kitchen category:', error)
        },
    })
}

export default useUpdateKitchenCategory
