import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getCategoryService, { type Category, type CreateUpdateCategory } from "../../../services/api/categoryService"

interface UpdateCategoryData {
    category: CreateUpdateCategory
    access: string
}

interface Props {
    categoryId: number
}

const useUpdateCategory = ({ categoryId }: Props): UseMutationResult<Category, Error, UpdateCategoryData> => {
    const categoryService = getCategoryService({ categoryId })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: UpdateCategoryData) => categoryService.update(data.category, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (error) => {
            console.error('Error updating category:', error)
        }
    })
}

export default useUpdateCategory

