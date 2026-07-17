import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Loader2, Plus } from 'lucide-react'
import useGetKitchenOrders from '../../../hooks/kitchen/order/useGetKitchenOrders'
import useCreateKitchenOrder from '../../../hooks/kitchen/order/useCreateKitchenOrder'
import useUpdateKitchenOrder from '../../../hooks/kitchen/order/useUpdateKitchenOrder'
import useDeleteKitchenOrder from '../../../hooks/kitchen/order/useDeleteKitchenOrder'
import useCreateKitchenCustomer from '../../../hooks/kitchen/customer/useCreateKitchenCustomer'
import useGetKitchenDishes from '../../../hooks/kitchen/dish/useGetKitchenDishes'
import useGetToppings from '../../../hooks/kitchen/topping/useGetToppings'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { KitchenOrder } from '../../../services/kitchen/orderService'
import {
    buildOrderPayload,
    initialOrderForm,
    orderToFormState,
    type OrderFormState,
} from '../../../utils/orderHelpers'
import Modal from '../../ui/Modal'
import OrderForm from './OrderForm'
import OrdersTable from './OrdersTable'

const validateOrder = (form: OrderFormState): string => {
    if (!form.account) return 'Selecciona una cuenta'
    if (form.customer_mode === 'new' && !form.customer_names.trim()) {
        return 'Ingresa el nombre del cliente o selecciona "Sin cliente"'
    }
    if (!form.order_date) return 'Selecciona la fecha de la orden'
    if (form.order_items.length === 0) return 'Agrega al menos un plato'
    if (form.order_items.some(item => !item.dish)) return 'Selecciona un plato en cada línea'
    if (form.order_items.some(item => item.quantity <= 0)) return 'Las cantidades deben ser mayores a cero'
    if (form.order_items.some(item => item.unit_price != null && item.unit_price <= 0)) {
        return 'El precio personalizado debe ser mayor a cero'
    }
    if (form.order_items.some(item =>
        item.toppings.some(line => !line.topping || line.quantity <= 0),
    )) {
        return 'Completa o elimina los toppings incompletos'
    }
    return ''
}

const OrdersMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetKitchenOrders({ access })
    const { data: dishes, isLoading: dishesLoading, error: dishesError } = useGetKitchenDishes({ access })
    const { data: toppings, isLoading: toppingsLoading, error: toppingsError } = useGetToppings({ access })
    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })

    const createOrder = useCreateKitchenOrder()
    const createCustomer = useCreateKitchenCustomer()
    const [form, setForm] = useState<OrderFormState>(initialOrderForm)
    const [formError, setFormError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(true)
    const [editingOrder, setEditingOrder] = useState<KitchenOrder | null>(null)
    const [editForm, setEditForm] = useState<OrderFormState>(initialOrderForm)
    const [editError, setEditError] = useState('')
    const [deletingOrder, setDeletingOrder] = useState<KitchenOrder | null>(null)

    const updateOrder = useUpdateKitchenOrder({ orderId: editingOrder?.id ?? 0 })
    const deleteOrder = useDeleteKitchenOrder({ orderId: deletingOrder?.id ?? 0 })

    const activeDishes = useMemo(
        () => (Array.isArray(dishes) ? dishes : []).filter(dish => dish.is_active),
        [dishes],
    )
    const activeToppings = useMemo(
        () => (Array.isArray(toppings) ? toppings : []).filter(topping => topping.is_active),
        [toppings],
    )
    const activeAccounts = useMemo(
        () => (Array.isArray(accounts) ? accounts : []).filter(account => account.is_active),
        [accounts],
    )
    const orderItems = Array.isArray(orders) ? orders : []

    useEffect(() => {
        if (!form.account && activeAccounts.length > 0) {
            setForm(current => ({ ...current, account: activeAccounts[0].id }))
        }
    }, [activeAccounts, form.account])

    const resetCreateForm = () => {
        const next = initialOrderForm()
        next.account = activeAccounts[0]?.id ?? 0
        setForm(next)
        setFormError('')
    }

    const handleCreate = async () => {
        const validationError = validateOrder(form)
        if (validationError) {
            setFormError(validationError)
            return
        }
        try {
            let formToSubmit = form
            if (form.customer_mode === 'new') {
                const customer = await createCustomer.mutateAsync({
                    customer: {
                        names: form.customer_names.trim(),
                        address: form.customer_address.trim(),
                        extra_info: form.customer_extra_info.trim(),
                    },
                    access,
                })
                formToSubmit = { ...form, customer_mode: 'existing', customer: customer.id }
                setForm(formToSubmit)
            }
            await createOrder.mutateAsync({ order: buildOrderPayload(formToSubmit), access })
            addNotification({
                title: 'Orden creada',
                message: 'La orden se registró correctamente',
                type: 'success',
            })
            resetCreateForm()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo crear la orden'
            setFormError(message)
            addNotification({
                title: 'Error',
                message: 'No se pudo crear el cliente o la orden',
                type: 'error',
            })
        }
    }

    const openEdit = (order: KitchenOrder) => {
        const nextForm = orderToFormState(order)
        if (!nextForm.account && activeAccounts.length === 1) {
            nextForm.account = activeAccounts[0].id
        }
        setEditingOrder(order)
        setEditForm(nextForm)
        setEditError('')
    }

    const handleUpdate = async () => {
        if (!editingOrder) return
        const validationError = validateOrder(editForm)
        if (validationError) {
            setEditError(validationError)
            return
        }
        try {
            let formToSubmit = editForm
            if (editForm.customer_mode === 'new') {
                const customer = await createCustomer.mutateAsync({
                    customer: {
                        names: editForm.customer_names.trim(),
                        address: editForm.customer_address.trim(),
                        extra_info: editForm.customer_extra_info.trim(),
                    },
                    access,
                })
                formToSubmit = { ...editForm, customer_mode: 'existing', customer: customer.id }
                setEditForm(formToSubmit)
            }
            await updateOrder.mutateAsync({ order: buildOrderPayload(formToSubmit), access })
            addNotification({
                title: 'Orden actualizada',
                message: `La orden #${editingOrder.id} se actualizó correctamente`,
                type: 'success',
            })
            setEditingOrder(null)
        } catch (error) {
            setEditError(error instanceof Error ? error.message : 'No se pudo actualizar la orden')
        }
    }

    const handleDelete = () => {
        if (!deletingOrder) return
        deleteOrder.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Orden eliminada',
                    message: `La orden #${deletingOrder.id} fue eliminada`,
                    type: 'success',
                })
                setDeletingOrder(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'No se pudo eliminar la orden',
                    type: 'error',
                })
            },
        })
    }

    const dependenciesLoading = dishesLoading || toppingsLoading || accountsLoading
    const dependenciesError = dishesError || toppingsError || accountsError

    if (dependenciesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (dependenciesError) {
        return (
            <div className="py-10 text-center text-red-600">
                Error al cargar los datos para órdenes: {dependenciesError.message}
            </div>
        )
    }

    const canCreate = activeDishes.length > 0 && activeAccounts.length > 0

    return (
        <div className="h-full p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
                            <p className="text-sm text-gray-500">Registra y administra órdenes con varios platos</p>
                        </div>
                    </div>
                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(current => !current)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        >
                            <Plus className="w-4 h-4" />
                            {showCreateForm ? 'Ocultar formulario' : 'Nueva orden'}
                        </button>
                    )}
                </motion.div>

                {!canCreate && (
                    <div className="p-4 text-sm text-amber-700 border border-amber-200 rounded-xl bg-amber-50">
                        Necesitas al menos una cuenta activa y un plato activo para crear órdenes.
                    </div>
                )}

                {canCreate && showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl"
                    >
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Nueva orden</h2>
                        <OrderForm
                            value={form}
                            dishes={activeDishes}
                            accounts={activeAccounts}
                            toppings={activeToppings}
                            isSubmitting={createOrder.isPending || createCustomer.isPending}
                            submitLabel="Crear orden"
                            error={formError}
                            onChange={(next) => {
                                setForm(next)
                                if (formError) setFormError('')
                            }}
                            onSubmit={handleCreate}
                        />
                    </motion.div>
                )}

                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Historial</h2>
                        <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                            {orderItems.length}
                        </span>
                    </div>
                    <OrdersTable
                        orders={orderItems}
                        accounts={activeAccounts}
                        isLoading={ordersLoading}
                        error={ordersError}
                        onEdit={openEdit}
                        onDelete={setDeletingOrder}
                    />
                </section>
            </div>

            <Modal isOpen={editingOrder != null} onClose={() => setEditingOrder(null)} width="max-w-6xl">
                <h2 className="mb-5 text-xl font-semibold text-gray-900">
                    Editar orden #{editingOrder?.id}
                </h2>
                <OrderForm
                    value={editForm}
                    dishes={activeDishes}
                    accounts={activeAccounts}
                    toppings={activeToppings}
                    isSubmitting={updateOrder.isPending || createCustomer.isPending}
                    submitLabel="Guardar cambios"
                    error={editError}
                    onChange={(next) => {
                        setEditForm(next)
                        if (editError) setEditError('')
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingOrder(null)}
                />
            </Modal>

            <Modal isOpen={deletingOrder != null} onClose={() => setDeletingOrder(null)}>
                <h2 className="text-xl font-semibold text-gray-900">Eliminar orden</h2>
                <p className="mt-3 text-sm text-gray-600">
                    ¿Seguro que deseas eliminar la orden #{deletingOrder?.id}? Esta acción puede revertir
                    el ingreso y los movimientos de inventario asociados.
                </p>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => setDeletingOrder(null)}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={deleteOrder.isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        disabled={deleteOrder.isPending}
                    >
                        {deleteOrder.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Eliminar
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default OrdersMain
