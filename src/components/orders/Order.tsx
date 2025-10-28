import { motion } from "framer-motion"
import CategoriesMain from "../categories/CategoriesMain"
import { ArrowLeft } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import DishesMain from "../dishes/DishesMain"
import RemoveOrder from "./RemoveOrder"

interface Props {
    handleBackStep: () => void
    setSelectedCategory: Dispatch<SetStateAction<number>>
    selectedCategory: number
    setCustomerInfo: (customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }) => void
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
    orderInfo: {
        id: number;
        orderNumber: string;
        customer: number;
        address: number;
        createdAt: string;
        updatedAt: string;
    }
    setOrderInfo: (orderInfo: {
        id: number;
        orderNumber: string;
        customer: number;
        address: number;
        createdAt: string;
        updatedAt: string;
    }) => void
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
}

const Order = ({ handleBackStep, setSelectedCategory, selectedCategory, orderInfo, setOrderInfo, setCustomerInfo, setAddressInfo, setOrderStep }: Props) => {
  return (
    <motion.div
        key="items"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex justify-between items-center mb-6">
            <>{console.log(orderInfo)}</>
            {/* Back Button */}
            <motion.button
                onClick={handleBackStep}
                className="mb-6 cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-medium"
                whileHover={{ scale: 1.02 }}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Editar información del domicilio
            </motion.button>
            <RemoveOrder 
                orderId={orderInfo.id}
                setOrderStep={setOrderStep}
                setOrderInfo={setOrderInfo}
                setCustomerInfo={setCustomerInfo}
                setAddressInfo={setAddressInfo}
            />
        </div>

        {/* Category Selection */}
        <CategoriesMain 
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        />

        {/* Items from Selected Category */}
        {selectedCategory && (
        <DishesMain categoryId={selectedCategory} orderId={orderInfo.id} />
        )}
    </motion.div>
  )
}

export default Order