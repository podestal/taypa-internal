import axios from "axios"
import CustomerOptions from "./CustomerOptions"
import { useEffect, useState } from "react";
import type { Customer } from "../../services/api/customerService";
import useAuthStore from "../../store/useAuthStore";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CreateCustomerData } from "../../hooks/api/customer/useCreateCustomer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
    handleNextStep: () => void
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }
    setCustomerInfo: (customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }) => void
    createCustomer: UseMutationResult<Customer, Error, CreateCustomerData>
}

const CustomerForm = ({ 
    customerInfo, 
    setCustomerInfo, 
    createCustomer, 
    handleNextStep }: Props) => {

    const access = useAuthStore(s => s.access) || ''
    const [customers, setCustomers] = useState<Customer[]>([])
    const [showOptions, setShowOptions] = useState(true)
    const [isCustomerInfoComplete, setIsCustomerInfoComplete] = useState(false)

    useEffect(() => {
        if (customerInfo.firstName && customerInfo.lastName && customerInfo.phone) {
            setIsCustomerInfoComplete(true)
        } else {
            setIsCustomerInfoComplete(false)
        }
    }, [customerInfo.firstName, customerInfo.lastName, customerInfo.phone])

    const handleCreateCustomer = () => {
        if (customerInfo.id > 0) {
            handleNextStep()
            return
        }
        createCustomer.mutate({
            customer: {
                first_name: customerInfo.firstName,
                last_name: customerInfo.lastName,
                phone_number: customerInfo.phone,
            },
            access: access
        }, {
            onSuccess: res => {
                setCustomerInfo({
                  ...customerInfo,
                  id: res.id
                })
                handleNextStep()
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCustomerInfo({
            ...customerInfo,
            [name]: value
        })
    }

    const handleGetCustomerByName = (name: string) => {
        if (name.length < 1) {
            setCustomers([])
            return
        }
        axios.get(`${import.meta.env.VITE_API_URL}customers/by_first_name/`, {
            params: {
                first_name: name
            },
            headers: {
                'Authorization': `JWT ${access}`
            }
        }).then((response) => {
            console.log(response.data)
            setCustomers(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleGetCustomerByLastName = (lastName: string) => {
        if (lastName.length < 1) {
            setCustomers([])
            return
        }
        axios.get(`${import.meta.env.VITE_API_URL}customers/by_last_name/`, {
            params: {
                last_name: lastName
            },
            headers: {
                'Authorization': `JWT ${access}`
            }
        }).then((response) => {
            console.log(response.data)
            setCustomers(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }
      
  return (
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCustomerInfo({
                                ...customerInfo,
                                firstName: e.target.value
                            })
                            handleGetCustomerByName(e.target.value)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nombre"
                          required
                        />
                        {(customerInfo.firstName.length > 0 && customers.length > 0 && showOptions) && <CustomerOptions setShowOptions={setShowOptions} setCustomerInfo={setCustomerInfo} customers={customers} byName={true} />}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCustomerInfo({
                                ...customerInfo,
                                lastName: e.target.value
                            })
                            handleGetCustomerByLastName(e.target.value)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apellido"
                          required
                        />
                        {customerInfo.lastName.length > 0 && customers.length > 0 && showOptions && <CustomerOptions setShowOptions={setShowOptions} setCustomerInfo={setCustomerInfo} customers={customers} byName={false} />}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleCustomerInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+52 55 1234 5678"
                          required
                        />
                      </div>
                    </div>
                    <motion.button
                        onClick={handleCreateCustomer}
                        disabled={!isCustomerInfoComplete}
                        className={`w-full py-3 mt-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
                        isCustomerInfoComplete
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        whileHover={isCustomerInfoComplete ? { scale: 1.02 } : {}}
                        whileTap={isCustomerInfoComplete ? { scale: 0.98 } : {}}
                    >
                        Continuar
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
  )
}

export default CustomerForm