import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getProductService, { type Product } from "../../../services/kitchen/productService"

interface Props {
    access: string
}

const useGetProducts = ({ access }: Props): UseQueryResult<Product[], Error> => {
    const productService = getProductService({})
    return useQuery({
        queryKey: ['products'],
        queryFn: () => productService.get(access),
    })
}

export default useGetProducts
