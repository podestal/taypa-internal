import { useState } from 'react'
import type { UseMutationResult } from "@tanstack/react-query";
import type { OrderItem } from "../../services/api/orderItemService";
import type { CreateOrderItemData } from "../../hooks/api/orderItem/useCreateOrderItem";
import useAuthStore from "../../store/useAuthStore";
import type { Dish } from "../../services/api/dishService";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface Props {
    createOrderItem: UseMutationResult<OrderItem, Error, CreateOrderItemData>
    orderId: number
    dish: Dish
}

const OrderItemForm = ({ createOrderItem, orderId, dish }: Props) => {
    const access = useAuthStore(state => state.access) || ''
    const [quantity, setQuantity] = useState(1)
    const [observations, setObservations] = useState('')

    const handleCreateOrderItem = () => {
        createOrderItem.mutate({
            access: access,
            orderItem: { 
                order: orderId,
                dish: dish.id,
                price: dish.price * quantity,
                quantity: quantity,
                category: dish.category,
                observation: observations.trim()
             }
        }, {
            onSuccess: (data) => {
                console.log('data', data);
                // Reset form
                setQuantity(1)
                setObservations('')
            },
            onError: (error) => {
                console.error('error', error);
            }
        })
    }

    const handleIncrement = () => {
        setQuantity(prev => prev + 1)
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg text-gray-700 font-bold">{dish.name}</h3>
                {/* <p className="text-lg text-gray-500">${dish.price}</p> */}
            </div>
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Cantidad</label>
                <div className="flex items-center gap-3">
                    <motion.button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'rgb(254 242 242)', color: 'rgb(220 38 38)' }}
                        whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                        whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                    >
                        <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                    <motion.button
                        onClick={handleIncrement}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: 'rgb(220 252 231)', color: 'rgb(22 163 74)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Plus className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Observations Textbox */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                </label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Especialidades, modificaciones, etc."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            {/* Add Button */}
            <motion.button
                className="w-fit px-4 py-2 cursor-pointer bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateOrderItem}
            >
                Agregar a la Orden
            </motion.button>
        </div>
    )
}

export default OrderItemForm