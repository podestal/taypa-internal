import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDishService, { type Dish, type CreateUpdateDish } from "../../../services/api/dishService"

interface UpdateDishData {
    dish: CreateUpdateDish
    image?: File
    access: string
}

interface Props {
    dishId: number
}

const useUpdateDish = ({ dishId }: Props): UseMutationResult<Dish, Error, UpdateDishData> => {
    const dishService = getDishService({ dishId })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: UpdateDishData) => {
            // If image exists, create FormData, otherwise send regular data
            if (data.image) {
                const formData = new FormData()
                formData.append('name', data.dish.name)
                formData.append('description', data.dish.description || '')
                formData.append('price', data.dish.price.toString())
                formData.append('category', data.dish.category.toString())
                formData.append('is_active', data.dish.is_active.toString())
                formData.append('image', data.image)
                return dishService.update(formData, data.access) as Promise<Dish>
            } else {
                return dishService.update(data.dish, data.access) as Promise<Dish>
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
        onError: (error) => {
            console.error('Error updating dish:', error)
        }
    })
}

export default useUpdateDish

