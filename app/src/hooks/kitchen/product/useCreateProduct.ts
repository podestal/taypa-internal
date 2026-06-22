import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getProductService, { type Product, type CreateUpdateProduct } from "../../../services/kitchen/productService"

interface CreateProductData {
    product: CreateUpdateProduct
    access: string
}

const useCreateProduct = (): UseMutationResult<Product, Error, CreateProductData> => {
    const productService = getProductService({})
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateProductData) => productService.post(data.product, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error('Error creating product:', error)
        }
    })
}

export default useCreateProduct
