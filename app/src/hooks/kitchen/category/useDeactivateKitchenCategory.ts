import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenCategoryService, { type KitchenCategory } from "../../../services/kitchen/categoryService"

interface DeactivateCategoryData {
    access: string
}

interface Props {
    categoryId: number
}

const useDeactivateKitchenCategory = ({ categoryId }: Props): UseMutationResult<KitchenCategory, Error, DeactivateCategoryData> => {
    const categoryService = getKitchenCategoryService({ categoryId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeactivateCategoryData) =>
            categoryService.update({ is_active: false }, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-categories'] })
        },
        onError: (error) => {
            console.error('Error deactivating kitchen category:', error)
        },
    })
}

export default useDeactivateKitchenCategory
