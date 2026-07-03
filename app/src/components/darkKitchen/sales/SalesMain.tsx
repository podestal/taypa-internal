import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt, Loader2 } from 'lucide-react'
import useGetSales from '../../../hooks/kitchen/sale/useGetSales'
import useCreateSale from '../../../hooks/kitchen/sale/useCreateSale'
import useCancelSale from '../../../hooks/kitchen/sale/useCancelSale'
import useGetKitchenDishes from '../../../hooks/kitchen/dish/useGetKitchenDishes'
import useGetKitchenCategories from '../../../hooks/kitchen/category/useGetKitchenCategories'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useGetToppings from '../../../hooks/kitchen/topping/useGetToppings'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { Sale } from '../../../services/kitchen/saleService'
import type { SaleFormState, SaleFormTopping, SaleDatePreset, SaleHistoryDatePreset } from '../../../utils/saleHelpers'
import {
    buildSaleListParams,
    buildSalePayload,
    getDefaultSaleHistoryFilters,
} from '../../../utils/saleHelpers'
import { yesterdayISO } from '../../../utils/inventoryHelpers'
import Modal from '../../ui/Modal'
import SaleForm from './SaleForm'
import SalesHistoryFilters from './SalesHistoryFilters'
import SalesHistoryTable from './SalesHistoryTable'

const getInitialFormData = (): SaleFormState => ({
    dish: 0,
    account: 0,
    quantity_sold: 0,
    unit_price: 0,
    sale_date: yesterdayISO(),
    notes: '',
    toppings: [],
})

const SalesMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: dishes, isLoading: dishesLoading, error: dishesError } = useGetKitchenDishes({ access })
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetKitchenCategories({
        access,
        params: { menu_item: 'true' },
    })
    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })
    const { data: toppings, isLoading: toppingsLoading, error: toppingsError } = useGetToppings({ access })
    const createSale = useCreateSale()

    const [historyFilters, setHistoryFilters] = useState(getDefaultSaleHistoryFilters)
    const saleListParams = useMemo(() => buildSaleListParams(historyFilters), [historyFilters])

    const {
        data: sales,
        isLoading: salesLoading,
        error: salesError,
    } = useGetSales({ access, params: saleListParams })

    const [formData, setFormData] = useState<SaleFormState>(getInitialFormData)
    const [saleDatePreset, setSaleDatePreset] = useState<SaleDatePreset>('yesterday')
    const [errors, setErrors] = useState({ dish: '', account: '', quantity_sold: '', sale_date: '' })
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

    const cancelSale = useCancelSale({ saleId: selectedSale?.id ?? 0 })

    const isPageLoading = dishesLoading || categoriesLoading || accountsLoading || toppingsLoading
    const pageError = dishesError || categoriesError || accountsError || toppingsError

    const saleItems = Array.isArray(sales) ? sales : []
    const allDishes = Array.isArray(dishes) ? dishes : []
    const categoryItems = Array.isArray(categories) ? categories : []
    const accountItems = Array.isArray(accounts) ? accounts : []
    const activeDishes = allDishes.filter(
        dish => dish.is_active && dish.ingredients.length > 0
    )
    const activeAccounts = accountItems.filter(account => account.is_active)
    const activeToppings = (Array.isArray(toppings) ? toppings : []).filter(t => t.is_active)

    useEffect(() => {
        if (!formData.account && activeAccounts.length > 0) {
            setFormData(prev => ({ ...prev, account: activeAccounts[0].id }))
        }
    }, [activeAccounts, formData.account])

    const handleHistoryDatePreset = (preset: SaleHistoryDatePreset) => {
        setHistoryFilters(prev => ({
            ...prev,
            datePreset: preset,
            start_date: preset === 'custom' ? prev.start_date : '',
            end_date: preset === 'custom' ? prev.end_date : '',
        }))
    }

    const resetForm = () => {
        setFormData(getInitialFormData())
        setSaleDatePreset('yesterday')
        setErrors({ dish: '', account: '', quantity_sold: '', sale_date: '' })
    }

    const validateForm = () => {
        const newErrors = { dish: '', account: '', quantity_sold: '', sale_date: '' }
        let hasError = false

        if (!formData.dish) {
            newErrors.dish = 'Selecciona un plato'
            hasError = true
        }
        if (!formData.account) {
            newErrors.account = 'Selecciona una cuenta'
            hasError = true
        }
        if (!formData.quantity_sold || formData.quantity_sold <= 0) {
            newErrors.quantity_sold = 'La cantidad debe ser mayor a 0'
            hasError = true
        }
        if (!formData.sale_date) {
            newErrors.sale_date = 'La fecha es requerida'
            hasError = true
        }

        setErrors(newErrors)
        return !hasError
    }

    const handleInputChange = (field: keyof Omit<SaleFormState, 'toppings'>, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleToppingChange = (index: number, field: keyof SaleFormTopping, value: number) => {
        setFormData(prev => ({
            ...prev,
            toppings: prev.toppings.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            ),
        }))
    }

    const handleAddTopping = () => {
        setFormData(prev => ({
            ...prev,
            toppings: [...prev.toppings, { topping: 0, quantity: 1 }],
        }))
    }

    const handleRemoveTopping = (index: number) => {
        setFormData(prev => ({
            ...prev,
            toppings: prev.toppings.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        createSale.mutate({ sale: buildSalePayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Venta registrada',
                    message: 'La venta se registró correctamente',
                    type: 'success',
                })
                const defaultAccount = formData.account
                resetForm()
                if (defaultAccount) {
                    setFormData(prev => ({ ...prev, account: defaultAccount }))
                }
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al registrar la venta',
                    type: 'error',
                })
            },
        })
    }

    const handleCancel = (sale: Sale) => {
        setSelectedSale(sale)
        setShowCancelModal(true)
    }

    const confirmCancel = () => {
        if (!selectedSale) return

        cancelSale.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Venta cancelada',
                    message: 'La venta fue cancelada correctamente',
                    type: 'success',
                })
                setShowCancelModal(false)
                setSelectedSale(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al cancelar la venta',
                    type: 'error',
                })
            },
        })
    }

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (pageError) {
        return (
            <div className="text-center text-red-500 py-8">
                Error al cargar ventas: {pageError.message}
            </div>
        )
    }

    const canCreateSale = activeDishes.length > 0 && activeAccounts.length > 0

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <Receipt className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
                </motion.div>

                {canCreateSale && (
                    <SaleForm
                        formData={formData}
                        errors={errors}
                        dishes={activeDishes}
                        accounts={activeAccounts}
                        toppings={activeToppings}
                        saleDatePreset={saleDatePreset}
                        isSubmitting={createSale.isPending}
                        onInputChange={handleInputChange}
                        onSaleDatePresetChange={setSaleDatePreset}
                        onToppingChange={handleToppingChange}
                        onAddTopping={handleAddTopping}
                        onRemoveTopping={handleRemoveTopping}
                        onSubmit={handleSubmit}
                    />
                )}

                {!canCreateSale && (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                        {activeDishes.length === 0 && (
                            <p>Crea platos activos con ingredientes para poder registrar ventas</p>
                        )}
                        {activeDishes.length > 0 && activeAccounts.length === 0 && (
                            <p>Crea una cuenta activa en Cuentas para poder registrar ventas</p>
                        )}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Historial</h2>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                            {salesLoading ? '...' : saleItems.length}
                        </span>
                    </div>

                    <SalesHistoryFilters
                        filters={historyFilters}
                        dishes={allDishes}
                        categories={categoryItems}
                        onFiltersChange={setHistoryFilters}
                        onDatePresetChange={handleHistoryDatePreset}
                    />

                    <SalesHistoryTable
                        sales={saleItems}
                        accounts={accountItems}
                        isLoading={salesLoading}
                        error={salesError}
                        onCancel={handleCancel}
                        cancellingSaleId={cancelSale.isPending ? selectedSale?.id ?? null : null}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Cancelar venta</h2>
                    <p className="text-gray-600">
                        ¿Cancelar la venta de <strong>"{selectedSale?.dish_name ?? `Plato #${selectedSale?.dish}`}"</strong>?
                        Se revertirá el ingreso y el inventario asociado.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            onClick={() => {
                                setShowCancelModal(false)
                                setSelectedSale(null)
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Volver
                        </motion.button>
                        <motion.button
                            onClick={confirmCancel}
                            disabled={cancelSale.isPending}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {cancelSale.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{cancelSale.isPending ? 'Cancelando...' : 'Confirmar'}</span>
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default SalesMain
