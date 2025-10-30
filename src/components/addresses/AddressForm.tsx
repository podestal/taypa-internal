import type { UseMutationResult } from "@tanstack/react-query"
import type { Address } from "../../services/api/addressService"
import type { CreateAddressData } from "../../hooks/api/address/useCreateAddress"
import useAuthStore from "../../store/useAuthStore"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import useUpdateAddress from "../../hooks/api/address/useUpdateAddress"
import useNotificationStore from "../../store/useNotificationStore"


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
    const { addNotification } = useNotificationStore()
    const [isAddressInfoComplete, setIsAddressInfoComplete] = useState(false)
    const [street, setStreet] = useState(addressInfo.street)
    const [reference, setReference] = useState(addressInfo.reference)

    // update service
    const updateAddress = useUpdateAddress({ addressId: addressInfo.id, customerId: customerInfo.id })

    useEffect(() => {
        console.log(street);
        
        if (addressInfo.street.trim().length > 0 || street.trim().length > 0) {
            setIsAddressInfoComplete(true)
        } else {
            setIsAddressInfoComplete(false)
        }
    }, [addressInfo.street, street])

    useEffect(() => {
        setStreet(addressInfo.street)
        setReference(addressInfo.reference)
    }, [addressInfo.street, addressInfo.reference])

    const handleCreateAddress = () => {

        console.log('addressInfo', addressInfo);
        
        if (addressInfo.id > 0) {
            if (street.trim() !== addressInfo.street.trim() || reference.trim() !== addressInfo.reference.trim()) {
                
                console.log('updating address');
                updateAddress.mutate({
                    address: {
                        street: street.trim(),
                        reference: reference.trim(),
                        customer: customerInfo.id,
                        is_primary: false
                    },
                    access: access
                }, {
                    onSuccess: (data) => {
                        console.log(data)
                        addNotification({
                            title: 'Dirección actualizada',
                            message: 'La dirección ha sido actualizada correctamente',
                            type: 'success'
                        })
                        setAddressInfo({
                            ...addressInfo,
                            street: data.street,
                            reference: data.reference,
                            customer: data.customer
                        })
                    },
                    onError: (error) => {
                        console.log(error)
                        addNotification({
                            title: 'Error al actualizar la dirección',
                            message: 'Ha ocurrido un error al actualizar la dirección',
                            type: 'error'
                        })
                    }
                })
            }
            handleNextStep()
        } else {
            createAddress.mutate({
                address: {
                    street: street.trim(),
                    reference: reference.trim(),
                    customer: customerInfo.id,
                    is_primary: false
                },
                access: access
            }, {
                onSuccess: (data) => {
                    console.log(data)
                    addNotification({
                        title: 'Dirección creada',
                        message: 'La dirección ha sido creada correctamente',
                        type: 'success'
                    })
                    setAddressInfo({
                        ...addressInfo,
                        id: data.id,
                        street: data.street,
                        reference: data.reference,
                        customer: data.customer
                    })
                    setStreet(data.street)
                    setReference(data.reference)
                    handleNextStep()
                },
                onError: (error) => {
                    console.log(error)
                    addNotification({
                        title: 'Error al crear la dirección',
                        message: 'Ha ocurrido un error al crear la dirección',
                        type: 'error'
                    })
                }
            })
        }

        
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
                value={street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStreet(e.target.value)
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
                value={reference}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setReference(e.target.value)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entre calles, edificio, etc."
                required
            />
        </div>
        <motion.button
            onClick={handleCreateAddress}
            disabled={!isAddressInfoComplete}
            className={`w-full py-3 mt-6 cursor-pointer rounded-lg font-medium transition-colors flex items-center justify-center ${
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