import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import getOrderService, { type CreateUpdateOrder, type Order } from "../../../services/api/orderService";

interface CreateOrderData {
    order: CreateUpdateOrder
    access: string
}

const useCreateOrder = (): UseMutationResult<Order, Error, CreateOrderData> => {
    const orderService = getOrderService({ })
    return useMutation({
        mutationFn: (data: CreateOrderData) => orderService.post(data.order, data.access),
        onSuccess: res => {
            console.log('res', res);
        },
        onError: error => {
            console.log('error', error);
        }
    })  
}

export default useCreateOrder