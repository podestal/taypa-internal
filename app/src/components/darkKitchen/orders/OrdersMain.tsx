import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Loader2, Plus } from 'lucide-react'
import useGetKitchenOrders from '../../../hooks/kitchen/order/useGetKitchenOrders'
import useCreateKitchenOrder from '../../../hooks/kitchen/order/useCreateKitchenOrder'
import useUpdateKitchenOrder from '../../../hooks/kitchen/order/useUpdateKitchenOrder'
import useDeleteKitchenOrder from '../../../hooks/kitchen/order/useDeleteKitchenOrder'
import useCreateKitchenCustomer from '../../../hooks/kitchen/customer/useCreateKitchenCustomer'
import useGetKitchenCustomers from '../../../hooks/kitchen/customer/useGetKitchenCustomers'
import useGetKitchenDishes from '../../../hooks/kitchen/dish/useGetKitchenDishes'
import useGetToppings from '../../../hooks/kitchen/topping/useGetToppings'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { KitchenOrder } from '../../../services/kitchen/orderService'
import type { KitchenCustomer } from '../../../services/kitchen/customerService'
import {
    buildOrderPayload,
    initialOrderForm,
    orderToFormState,
    type OrderFormState,
} from '../../../utils/orderHelpers'
import Modal from '../../ui/Modal'
import OrderForm from './OrderForm'
import OrdersTable from './OrdersTable'
import CustomerStep from './CustomerStep'

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
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })

    const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetKitchenOrders({
        access,
        params: { date: today },
    })
    const { data: dishes, isLoading: dishesLoading, error: dishesError } = useGetKitchenDishes({ access })
    const { data: toppings, isLoading: toppingsLoading, error: toppingsError } = useGetToppings({ access })
    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })
    const {
        data: customers,
        isLoading: customersLoading,
        error: customersError,
    } = useGetKitchenCustomers({ access })

    const createOrder = useCreateKitchenOrder()
    const createCustomer = useCreateKitchenCustomer()
    const [form, setForm] = useState<OrderFormState>(initialOrderForm)
    const [formError, setFormError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(true)
    const [createStep, setCreateStep] = useState<1 | 2>(1)
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
    const todayOrderItems = orderItems.filter(order =>
        (order.order_date || order.created_at).split('T')[0] === today,
    )
    const customerItems = Array.isArray(customers) ? customers : []

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
        setCreateStep(1)
    }

    const cancelDraft = () => {
        resetCreateForm()
        setShowCreateForm(false)
    }

    const continueFromCustomer = () => {
        if (form.customer_mode === 'existing' && !form.customer) {
            setFormError('Selecciona un cliente para continuar')
            return
        }
        setFormError('')
        setCreateStep(2)
    }

    const createCustomerAndContinue = async () => {
        if (!form.customer_names.trim()) {
            setFormError('Ingresa el nombre del cliente')
            return
        }
        try {
            const customer = await createCustomer.mutateAsync({
                customer: {
                    names: form.customer_names.trim(),
                    address: form.customer_address.trim(),
                    extra_info: form.customer_extra_info.trim(),
                },
                access,
            })
            setForm(current => ({
                ...current,
                customer_mode: 'existing',
                customer: customer.id,
                customer_names: customer.names,
                customer_address: customer.address,
                customer_extra_info: customer.extra_info,
            }))
            setFormError('')
            setCreateStep(2)
        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'No se pudo crear el cliente')
        }
    }

    const selectCustomerAndContinue = (customer: KitchenCustomer) => {
        setForm({
            ...form,
            customer_mode: 'existing',
            customer: customer.id,
            customer_names: customer.names,
            customer_address: customer.address,
            customer_extra_info: customer.extra_info,
        })
        setFormError('')
        requestAnimationFrame(() => setCreateStep(2))
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
                    title: 'Orden cancelada',
                    message: `La orden #${deletingOrder.id} fue cancelada`,
                    type: 'success',
                })
                setDeletingOrder(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'No se pudo cancelar la orden',
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
                            onClick={() => {
                                if (showCreateForm) {
                                    cancelDraft()
                                } else {
                                    resetCreateForm()
                                    setShowCreateForm(true)
                                }
                            }}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        >
                            <Plus className="w-4 h-4" />
                            {showCreateForm ? 'Cancelar orden' : 'Nueva orden'}
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
                        {createStep === 1 ? (
                            <CustomerStep
                                form={form}
                                customers={customerItems}
                                isLoading={customersLoading}
                                isCreating={createCustomer.isPending}
                                error={formError || customersError?.message}
                                onChange={(next) => {
                                    setForm(next)
                                    if (formError) setFormError('')
                                }}
                                onSelect={selectCustomerAndContinue}
                                onContinue={continueFromCustomer}
                                onCreate={createCustomerAndContinue}
                                onCancel={cancelDraft}
                            />
                        ) : (
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
                                            Paso 2 de 2
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                            Armar la orden
                                        </h2>
                                    </div>
                                    <div className="px-3 py-2 text-sm rounded-lg bg-gray-50">
                                        <span className="text-gray-500">Cliente: </span>
                                        <span className="font-medium text-gray-900">
                                            {form.customer_mode === 'anonymous'
                                                ? 'Anónimo'
                                                : form.customer_names}
                                        </span>
                                    </div>
                                </div>
                                <OrderForm
                                    value={form}
                                    dishes={activeDishes}
                                    accounts={activeAccounts}
                                    toppings={activeToppings}
                                    isSubmitting={createOrder.isPending}
                                    submitLabel="Confirmar orden"
                                    cancelLabel="Cancelar orden"
                                    showCustomerSection={false}
                                    error={formError}
                                    onChange={(next) => {
                                        setForm(next)
                                        if (formError) setFormError('')
                                    }}
                                    onSubmit={handleCreate}
                                    onBack={() => setCreateStep(1)}
                                    onCancel={cancelDraft}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Historial de hoy</h2>
                        <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                            {todayOrderItems.length}
                        </span>
                    </div>
                    <OrdersTable
                        orders={todayOrderItems}
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
                <h2 className="text-xl font-semibold text-gray-900">Cancelar orden</h2>
                <p className="mt-3 text-sm text-gray-600">
                    ¿Seguro que deseas cancelar la orden #{deletingOrder?.id}? Esta acción puede revertir
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
                        Cancelar orden
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default OrdersMain
