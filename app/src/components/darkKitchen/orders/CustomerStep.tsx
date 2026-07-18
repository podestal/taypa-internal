import { useMemo, useState } from 'react'
import { Loader2, Search, UserRound, UserRoundX } from 'lucide-react'
import type { KitchenCustomer } from '../../../services/kitchen/customerService'
import type { OrderFormState } from '../../../utils/orderHelpers'

interface Props {
    form: OrderFormState
    customers: KitchenCustomer[]
    isLoading: boolean
    isCreating: boolean
    error?: string
    onChange: (form: OrderFormState) => void
    onSelect: (customer: KitchenCustomer) => void
    onContinue: () => void
    onCreate: () => void
    onCancel: () => void
}

const CustomerStep = ({
    form,
    customers,
    isLoading,
    isCreating,
    error,
    onChange,
    onSelect,
    onContinue,
    onCreate,
    onCancel,
}: Props) => {
    const [search, setSearch] = useState(form.customer_names)
    const hasCustomer = form.customer_mode !== 'anonymous'

    const matches = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return []
        return customers.filter(customer =>
            customer.names.toLowerCase().includes(query),
        ).slice(0, 8)
    }, [customers, search])

    const chooseWithCustomer = () => {
        onChange({
            ...form,
            customer_mode: form.customer ? 'existing' : 'new',
        })
    }

    const chooseAnonymous = () => {
        onChange({
            ...form,
            customer_mode: 'anonymous',
            customer: null,
        })
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        onChange({
            ...form,
            customer_mode: 'new',
            customer: null,
            customer_names: value,
            customer_address: '',
            customer_extra_info: '',
        })
    }

    return (
        <div className="space-y-5">
            <div>
                <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">Paso 1 de 2</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900">Cliente</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Busca al cliente por nombre. Si no existe, créalo usando el mismo nombre.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={chooseWithCustomer}
                    className={`flex items-center justify-center gap-2 p-4 border rounded-xl ${
                        hasCustomer
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                >
                    <UserRound className="w-5 h-5" />
                    <span className="text-sm font-semibold">Con cliente</span>
                </button>
                <button
                    type="button"
                    onClick={chooseAnonymous}
                    className={`flex items-center justify-center gap-2 p-4 border rounded-xl ${
                        !hasCustomer
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                >
                    <UserRoundX className="w-5 h-5" />
                    <span className="text-sm font-semibold">Sin cliente</span>
                </button>
            </div>

            {hasCustomer ? (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Nombre del cliente
                        </label>
                        <div className="relative">
                            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                value={search}
                                onChange={(event) => handleSearchChange(event.target.value)}
                                placeholder="Escribe el nombre..."
                                className="w-full py-3 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {isLoading && search.trim() && (
                        <div className="flex justify-center py-5">
                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        </div>
                    )}

                    {!isLoading && matches.length > 0 && (
                        <div className="overflow-hidden bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl">
                            <p className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                                Clientes encontrados
                            </p>
                            {matches.map(customer => (
                                <button
                                    type="button"
                                    key={customer.id}
                                    onClick={() => onSelect(customer)}
                                    className="flex items-center justify-between w-full gap-3 px-4 py-3 text-left hover:bg-indigo-50"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">{customer.names}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {customer.address || customer.extra_info || 'Sin información adicional'}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-indigo-600 shrink-0">
                                        Seleccionar
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {search.trim() && (
                        <div className="p-4 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/40">
                            <p className="text-sm font-semibold text-gray-900">
                                ¿No encuentras a “{search.trim()}”?
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Completa los datos opcionales y crea el cliente.
                            </p>
                            <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-700">Dirección</label>
                                    <input
                                        value={form.customer_address}
                                        onChange={(event) => onChange({
                                            ...form,
                                            customer_address: event.target.value,
                                        })}
                                        placeholder="Opcional"
                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-700">
                                        Información adicional
                                    </label>
                                    <input
                                        value={form.customer_extra_info}
                                        onChange={(event) => onChange({
                                            ...form,
                                            customer_extra_info: event.target.value,
                                        })}
                                        placeholder="Opcional"
                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onCreate}
                                disabled={isCreating}
                                className="inline-flex items-center gap-2 px-5 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
                            >
                                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                Crear cliente y continuar
                            </button>
                        </div>
                    )}

                    {form.customer && (
                        <button
                            type="button"
                            onClick={onContinue}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            Continuar con {form.customer_names}
                        </button>
                    )}
                </div>
            ) : (
                <div className="p-5 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-600">La orden no tendrá un cliente asociado.</p>
                    <button
                        type="button"
                        onClick={onContinue}
                        className="px-5 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        Continuar sin cliente
                    </button>
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                >
                    Cancelar orden
                </button>
            </div>
        </div>
    )
}

export default CustomerStep
