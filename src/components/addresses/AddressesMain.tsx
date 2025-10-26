import { motion } from "framer-motion";
import useGetAddressesByCustomer from "../../hooks/api/address/useGetAddressesByCustomer";
import useAuthStore from "../../store/useAuthStore";
import CreateAddress from "./CreateAddress";
import { ArrowLeft } from "lucide-react";

interface Props {
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
    handleNextStep: () => void
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
}


const AddressesMain = ({ addressInfo, setAddressInfo, customerInfo, handleNextStep, setOrderStep }: Props) => {
    const access = useAuthStore(s => s.access) || ''
    const { data: addresses, isLoading, error, isError, isSuccess } = useGetAddressesByCustomer({ access: access, customerId: customerInfo.id })
    
  return (
    <>
            <motion.button
                onClick={() => setOrderStep('customer')}
                className="mb-6 flex items-center cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                whileHover={{ scale: 1.02 }}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Editar información del cliente
            </motion.button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del domicilio</h3>
            <div>
            {isLoading && <p className="text-gray-500 text-center my-4 animate-pulse text-xs">Loading...</p>}
            {isError && <p className="text-red-500 text-center my-4 text-xs">Error: {error?.message}</p>}
            {isSuccess && addresses && addresses.length > 0 && (
                <>
                <div>
                    <h2 className="text-lg font-bold">Addresses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map((address) => (
                        <div key={address.id}>
                            <h3 className="text-lg font-bold">{address.street}</h3>
                        </div>
                    ))}
                </div>
                </>
            )}
            {isSuccess && addresses && addresses.length === 0 && (
                <div>
                    <p className="text-gray-500 text-center my-4 text-xs">No hay direcciones registradas</p>
                </div>
            )}
        </div>
        <CreateAddress 
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            customerInfo={customerInfo}
            handleNextStep={handleNextStep}
        />
    </>
  )
}

export default AddressesMain