import type { Address } from "../../services/api/addressService"

interface Props {
    address: Address
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
}

const AdrressCard = ({ address, setAddressInfo }: Props) => {
  return (
    <div 
        onClick={() => setAddressInfo(address)}
        className="my-4 p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition-shadow duration-300">
        <h3 className="text-md font-semibold text-gray-900">{address.street}</h3>
        <p className="text-xs text-gray-500">{address.reference}</p>
    </div>
  )
}

export default AdrressCard