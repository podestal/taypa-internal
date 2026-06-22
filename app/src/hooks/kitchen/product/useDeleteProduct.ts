import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getProductService, { type Product } from "../../../services/kitchen/productService"

interface DeleteProductData {
    access: string
}

interface Props {
    productId: number
}

const useDeleteProduct = ({ productId }: Props): UseMutationResult<Product, Error, DeleteProductData> => {
    const productService = getProductService({ productId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteProductData) => productService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error('Error deleting product:', error)
        }
    })
}

export default useDeleteProduct
