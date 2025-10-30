import type { Customer } from "../../services/api/customerService"
import useCustomerInfo from "../../store/useCustomerInfo"

interface Props {
    customers: Customer[]
    byName: boolean
    setShowOptions: (showOptions: boolean) => void
    setFullName: (fullName: string) => void
}

const CustomerOptions = ({ customers, byName=false, setShowOptions, setFullName }: Props) => {
    const setCustomerInfo = useCustomerInfo(state => state.setCustomerInfo)
    
  return (
    <div className="flex flex-col gap-2 absolute top-20 left-0 w-full bg-white z-10">
        {customers.map((customer) => (
            <button 
                key={customer.id} 
                onClick={() => {
                    setCustomerInfo({
                        id: customer.id,
                        phone: customer.phone_number,
                        firstName: customer.first_name,
                        lastName: customer.last_name,
                    })
                    setShowOptions(false)
                    setFullName('')
                }}
                className="w-full cursor-pointer hover:bg-gray-100 transition-colors text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span className={`${byName ? 'font-bold' : ''}`}>{customer.first_name} </span>
                <span className={`${!byName ? 'font-bold' : ''}`}>{customer.last_name} </span>
            </button>
        ))}
    </div>
  )
}

export default CustomerOptions