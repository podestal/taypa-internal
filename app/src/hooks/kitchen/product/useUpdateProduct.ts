import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getProductService, { type Product, type CreateUpdateProduct } from "../../../services/kitchen/productService"

interface UpdateProductData {
    product: CreateUpdateProduct
    access: string
}

interface Props {
    productId: number
}

const useUpdateProduct = ({ productId }: Props): UseMutationResult<Product, Error, UpdateProductData> => {
    const productService = getProductService({ productId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateProductData) => productService.update(data.product, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error('Error updating product:', error)
        }
    })
}

export default useUpdateProduct
