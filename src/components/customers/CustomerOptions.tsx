import type { Customer } from "../../services/api/customerService"

interface Props {
    customers: Customer[]
    byName: boolean
    setCustomerInfo: (customerInfo: {
        firstName: string
        lastName: string
        phone: string
        address: string
        addressReference: string
    }) => void
    setShowOptions: (showOptions: boolean) => void
}

const CustomerOptions = ({ customers, byName=false, setCustomerInfo, setShowOptions }: Props) => {
  return (
    <div className="flex flex-col gap-2 absolute top-20 left-0 w-full bg-white">
        {customers.map((customer) => (
            <button 
                key={customer.id} 
                onClick={() => {
                    setCustomerInfo({
                        phone: customer.phone_number,
                        address: '',
                        addressReference: '',
                        firstName: customer.first_name,
                        lastName: customer.last_name,
                    })
                    setShowOptions(false)
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