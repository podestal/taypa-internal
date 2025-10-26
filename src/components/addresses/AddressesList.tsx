import useAuthStore from "../../store/useAuthStore"
import useGetAddressesByCustomer from "../../hooks/api/address/useGetAddressesByCustomer"
import AdrressCard from "./AdrressCard"

interface Props {
    customerId: number
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
}

const AddressesList = ({ customerId, addressInfo, setAddressInfo }: Props) => {

    const access = useAuthStore(s => s.access) || ''
    const { data: addresses, isLoading, error, isError, isSuccess } = useGetAddressesByCustomer({ access: access, customerId: customerId })
    
    if (isLoading) return <p className="text-gray-500 text-center my-4 animate-pulse text-xs">Loading...</p>
    if (isError) return <p className="text-red-500 text-center my-4 text-xs">Error: {error?.message}</p>
    if (isSuccess && addresses && addresses.length === 0) return <p className="text-gray-500 text-center my-4 text-xs">No hay direcciones registradas</p>
    if (isSuccess && addresses && addresses.length > 0) 
  return (
    <div>
        {addresses.map((address) => (
            <AdrressCard 
                key={address.id} 
                address={address} 
                setAddressInfo={setAddressInfo}
                isSelected={addressInfo.id === address.id}
            />
        ))}
    </div>
  )
}

export default AddressesList