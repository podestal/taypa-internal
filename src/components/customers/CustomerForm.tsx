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

    const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCustomerInfo({
            ...customerInfo,
            [name]: value
        })
    }
      
  return (
<div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleCustomerInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nombre"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleCustomerInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apellido"
                          required
                        />
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