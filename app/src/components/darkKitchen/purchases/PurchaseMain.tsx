import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2 } from 'lucide-react'
import useGetPurchases from '../../../hooks/kitchen/purchase/useGetPurchases'
import useCreatePurchase from '../../../hooks/kitchen/purchase/useCreatePurchase'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type {
    PurchaseFormState,
    PurchaseDatePreset,
    PurchaseHistoryDatePreset,
} from '../../../utils/purchaseHelpers'
import {
    buildPurchaseListParams,
    buildPurchasePayload,
    getDefaultPurchaseHistoryFilters,
} from '../../../utils/purchaseHelpers'
import { yesterdayISO } from '../../../utils/inventoryHelpers'
import PurchaseForm from './PurchaseForm'
import PurchasesHistoryFilters from './PurchasesHistoryFilters'
import PurchasesHistoryTable from './PurchasesHistoryTable'

const getInitialFormData = (): PurchaseFormState => ({
    product: 0,
    account: 0,
    quantity_bought: 0,
    total_price: 0,
    purchase_date: yesterdayISO(),
    notes: '',
})

const PurchaseMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: products, isLoading: productsLoading, error: productsError } = useGetProducts({
        access,
        params: { include_all: 'true' },
    })
    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })
    const createPurchase = useCreatePurchase()

    const [historyFilters, setHistoryFilters] = useState(getDefaultPurchaseHistoryFilters)
    const purchaseListParams = useMemo(() => buildPurchaseListParams(historyFilters), [historyFilters])

    const {
        data: purchases,
        isLoading: purchasesLoading,
        error: purchasesError,
    } = useGetPurchases({ access, params: purchaseListParams })

    const [formData, setFormData] = useState<PurchaseFormState>(getInitialFormData)
    const [purchaseDatePreset, setPurchaseDatePreset] = useState<PurchaseDatePreset>('yesterday')
    const [errors, setErrors] = useState({
        product: '',
        account: '',
        quantity_bought: '',
        total_price: '',
        purchase_date: '',
    })

    const isPageLoading = productsLoading || accountsLoading
    const pageError = productsError || accountsError

    const purchaseItems = Array.isArray(purchases) ? purchases : []
    const productItems = Array.isArray(products) ? products : []
    const accountItems = Array.isArray(accounts) ? accounts : []
    const activeAccounts = accountItems.filter(account => account.is_active)

    useEffect(() => {
        if (!formData.account && activeAccounts.length > 0) {
            setFormData(prev => ({ ...prev, account: activeAccounts[0].id }))
        }
    }, [activeAccounts, formData.account])

    const handleHistoryDatePreset = (preset: PurchaseHistoryDatePreset) => {
        setHistoryFilters(prev => ({
            ...prev,
            datePreset: preset,
            start_date: preset === 'custom' ? prev.start_date : '',
            end_date: preset === 'custom' ? prev.end_date : '',
        }))
    }

    const resetForm = () => {
        setFormData(getInitialFormData())
        setPurchaseDatePreset('yesterday')
        setErrors({ product: '', account: '', quantity_bought: '', total_price: '', purchase_date: '' })
    }

    const validateForm = () => {
        const newErrors = {
            product: '',
            account: '',
            quantity_bought: '',
            total_price: '',
            purchase_date: '',
        }
        let hasError = false

        if (!formData.product) {
            newErrors.product = 'Selecciona un producto'
            hasError = true
        }
        if (!formData.account) {
            newErrors.account = 'Selecciona una cuenta'
            hasError = true
        }
        if (!formData.quantity_bought || formData.quantity_bought <= 0) {
            newErrors.quantity_bought = 'La cantidad debe ser mayor a 0'
            hasError = true
        }
        if (!formData.total_price || formData.total_price <= 0) {
            newErrors.total_price = 'El precio total debe ser mayor a 0'
            hasError = true
        }
        if (!formData.purchase_date) {
            newErrors.purchase_date = 'La fecha es requerida'
            hasError = true
        }

        setErrors(newErrors)
        return !hasError
    }

    const handleInputChange = (field: keyof PurchaseFormState, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        createPurchase.mutate({ purchase: buildPurchasePayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Compra registrada',
                    message: 'La compra se registró correctamente',
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
                    message: 'Error al registrar la compra',
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
                Error al cargar compras: {pageError.message}
            </div>
        )
    }

    const canCreatePurchase = productItems.length > 0 && activeAccounts.length > 0

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <ShoppingCart className="w-8 h-8 text-violet-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
                </motion.div>

                {canCreatePurchase && (
                    <PurchaseForm
                        formData={formData}
                        errors={errors}
                        products={productItems}
                        accounts={activeAccounts}
                        purchaseDatePreset={purchaseDatePreset}
                        isSubmitting={createPurchase.isPending}
                        onInputChange={handleInputChange}
                        onPurchaseDatePresetChange={setPurchaseDatePreset}
                        onSubmit={handleSubmit}
                    />
                )}

                {!canCreatePurchase && (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                        {productItems.length === 0 && <p>Crea productos primero para poder registrar compras</p>}
                        {productItems.length > 0 && activeAccounts.length === 0 && (
                            <p>Crea una cuenta activa en Cuentas para poder registrar compras</p>
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
                        <span className="px-2 py-1 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full">
                            {purchasesLoading ? '...' : purchaseItems.length}
                        </span>
                    </div>

                    <PurchasesHistoryFilters
                        filters={historyFilters}
                        products={productItems}
                        accounts={accountItems}
                        onFiltersChange={setHistoryFilters}
                        onDatePresetChange={handleHistoryDatePreset}
                    />

                    <PurchasesHistoryTable
                        purchases={purchaseItems}
                        products={productItems}
                        accounts={accountItems}
                        isLoading={purchasesLoading}
                        error={purchasesError}
                    />
                </motion.div>
            </div>
        </div>
    )
}

export default PurchaseMain
