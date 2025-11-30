import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getCategoryService, { type Category, type CreateUpdateCategory } from "../../../services/api/categoryService"

interface CreateCategoryData {
    category: CreateUpdateCategory
    access: string
}

const useCreateCategory = (): UseMutationResult<Category, Error, CreateCategoryData> => {
    const categoryService = getCategoryService({})
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: CreateCategoryData) => categoryService.post(data.category, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (error) => {
            console.error('Error creating category:', error)
        }
    })
}

export default useCreateCategory

