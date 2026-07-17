import { Loader2, Pencil, Trash2 } from 'lucide-react'
import type { KitchenOrder } from '../../../services/kitchen/orderService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    orders: KitchenOrder[]
    accounts: KitchenAccount[]
    isLoading: boolean
    error?: Error | null
    onEdit: (order: KitchenOrder) => void
    onDelete: (order: KitchenOrder) => void
}

const OrdersTable = ({ orders, accounts, isLoading, error, onEdit, onDelete }: Props) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-14 bg-white border border-gray-200 rounded-xl">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-12 text-center text-red-600 bg-white border border-gray-200 rounded-xl">
                Error al cargar órdenes: {error.message}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
                No hay órdenes registradas
            </div>
        )
    }

    const sortedOrders = [...orders].sort((a, b) =>
        (b.order_date || b.created_at).localeCompare(a.order_date || a.created_at),
    )

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-gray-600 bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 font-medium text-left">Orden</th>
                            <th className="px-4 py-3 font-medium text-left">Fecha</th>
                            <th className="px-4 py-3 font-medium text-left">Cliente</th>
                            <th className="px-4 py-3 font-medium text-left">Cuenta</th>
                            <th className="px-4 py-3 font-medium text-left">Detalle</th>
                            <th className="px-4 py-3 font-medium text-left">Notas</th>
                            <th className="px-4 py-3 font-medium text-right">Total</th>
                            <th className="px-4 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedOrders.map(order => {
                            const accountName = order.account_name
                                ?? accounts.find(account => account.id === order.account)?.name
                                ?? (order.account ? `Cuenta #${order.account}` : '—')
                            const detail = order.items.map(item => {
                                const toppings = item.toppings.length
                                    ? ` + ${item.toppings.map(line => `${formatDecimal(line.quantity)} ${line.topping_name ?? `Topping #${line.topping}`}`).join(', ')}`
                                    : ''
                                return `${formatDecimal(item.quantity)}× ${item.dish_name ?? `Plato #${item.dish}`}${toppings}`
                            }).join(' · ')

                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold text-gray-900">#{order.id}</td>
                                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                        {formatDate(order.order_date || order.created_at)}
                                    </td>
                                    <td
                                        className="max-w-[180px] px-4 py-3 text-gray-700 truncate"
                                        title={order.customer_details?.address}
                                    >
                                        {order.customer_details?.names || 'Anónimo'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{accountName}</td>
                                    <td className="max-w-sm px-4 py-3 text-gray-700">
                                        <span className="line-clamp-2" title={detail}>{detail || '—'}</span>
                                    </td>
                                    <td className="max-w-[180px] px-4 py-3 text-gray-600 truncate" title={order.notes}>
                                        {order.notes || '—'}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-right text-indigo-700 whitespace-nowrap">
                                        S/ {formatDecimal(order.subtotal)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(order)}
                                                className="p-2 text-indigo-600 rounded-lg hover:bg-indigo-50"
                                                title="Editar orden"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(order)}
                                                className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                                                title="Eliminar orden"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrdersTable
