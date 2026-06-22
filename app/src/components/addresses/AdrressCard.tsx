import { motion } from "framer-motion";
import type { Address } from "../../services/api/addressService"
import useAddressInfo from "../../store/useAddressInfo";

interface Props {
    address: Address
}

const AdrressCard = ({ address }: Props) => {
  
  const { addressInfo, setAddressInfo } = useAddressInfo()
  const isSelected = addressInfo.id === address.id
  const handleClick = () => {
    if (isSelected) {
      // Deselect: clear the address info
      setAddressInfo({
        id: 0,
        street: '',
        reference: '',
        is_primary: false,
        customer: 0,
      })
    } else {
      // Select: set the address info
      setAddressInfo({
        id: address.id,
        street: address.street,
        reference: address.reference,
        is_primary: address.is_primary,
        customer: address.customer,
      })
    }
  }

  return (
    <motion.div 
        layout
        onClick={handleClick}
        className={`my-4 p-4 border-2 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
            isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-md font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {address.street}
          </h3>
          <p className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
            {address.reference}
          </p>
        </div>
        {isSelected && (
          <div className="ml-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdrressCard