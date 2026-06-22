import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getCategoryService, { type Category } from "../../../services/api/categoryService"

interface DeleteCategoryData {
    access: string
}

interface Props {
    categoryId: number
}

const useDeleteCategory = ({ categoryId }: Props): UseMutationResult<Category, Error, DeleteCategoryData> => {
    const categoryService = getCategoryService({ categoryId })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: DeleteCategoryData) => categoryService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (error) => {
            console.error('Error deleting category:', error)
        }
    })
}

export default useDeleteCategory

