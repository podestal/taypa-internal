import axios from "axios"
import CustomerOptions from "./CustomerOptions"
import { useState } from "react";
import type { Customer } from "../../services/api/customerService";
import useAuthStore from "../../store/useAuthStore";

interface Props {
    customerInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }
    setCustomerInfo: (customerInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }) => void
}

const CustomerForm = ({ customerInfo, setCustomerInfo }: Props) => {

    const access = useAuthStore(s => s.access) || ''
    const [customers, setCustomers] = useState<Customer[]>([])
    const [showOptions, setShowOptions] = useState(true)
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
                    <>{console.log(customerInfo)}</>
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
                        <>{console.log(showOptions)}</>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleCustomerInputChange}
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
                          value={customerInfo.addressReference}
                          onChange={handleCustomerInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Entre calles, edificio, etc."
                          required
                        />
                      </div>
                    </div>
                  </div>
  )
}

export default CustomerForm