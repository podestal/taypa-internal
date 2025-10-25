import type { UseMutationResult } from "@tanstack/react-query"
import type { Address } from "../../services/api/addressService"
import type { CreateAddressData } from "../../hooks/api/address/useCreateAddress"
import useAuthStore from "../../store/useAuthStore"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"


interface Props {
    createAddress: UseMutationResult<Address, Error, CreateAddressData>
    handleNextStep: () => void
    addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }
}

const AddressForm = ({ createAddress, handleNextStep, addressInfo, setAddressInfo, customerInfo }: Props) => {
    const access = useAuthStore(s => s.access) || ''
    const [isAddressInfoComplete, setIsAddressInfoComplete] = useState(false)

    useEffect(() => {
        if (addressInfo.street && addressInfo.reference) {
            setIsAddressInfoComplete(true)
        } else {
            setIsAddressInfoComplete(false)
        }
    }, [addressInfo.street, addressInfo.reference])

    const handleCreateAddress = () => {
        createAddress.mutate({
            address: {
                street: addressInfo.street,
                reference: addressInfo.reference,
                customer: customerInfo.id,
                is_primary: false
            },
            access: access
        }, {
            onSuccess: (data) => {
                console.log(data)
                setAddressInfo({
                    ...addressInfo,
                    street: data.street,
                    reference: data.reference,
                    customer: data.customer
                })
                handleNextStep()
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
  return (
    <>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
            </label>
            <input
                type="text"
                name="address"
                value={addressInfo.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddressInfo({
                        ...addressInfo,
                        street: e.target.value
                    })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Calle, número, colonia"
                required
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia de Dirección
            </label>
            <input
                type="text"
                name="addressReference"
                value={addressInfo.reference}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddressInfo({
                        ...addressInfo,
                        reference: e.target.value
                    })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entre calles, edificio, etc."
                required
            />
        </div>
        <motion.button
            onClick={handleCreateAddress}
            disabled={!isAddressInfoComplete}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
            isAddressInfoComplete
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isAddressInfoComplete ? { scale: 1.02 } : {}}
            whileTap={isAddressInfoComplete ? { scale: 0.98 } : {}}
        >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
    </>
  )
}

export default AddressForm