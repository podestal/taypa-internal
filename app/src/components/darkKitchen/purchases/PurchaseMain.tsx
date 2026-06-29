import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2 } from 'lucide-react'
import useGetPurchases from '../../../hooks/kitchen/purchase/useGetPurchases'
import useCreatePurchase from '../../../hooks/kitchen/purchase/useCreatePurchase'
import useUpdatePurchase from '../../../hooks/kitchen/purchase/useUpdatePurchase'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { Purchase } from '../../../services/kitchen/purchaseService'
import type {
    PurchaseFormState,
    PurchaseDatePreset,
    PurchaseHistoryDatePreset,
} from '../../../utils/purchaseHelpers'
import {
    buildPurchaseListParams,
    buildPurchasePayload,
    getDefaultPurchaseHistoryFilters,
    purchaseToFormState,
} from '../../../utils/purchaseHelpers'
import { yesterdayISO } from '../../../utils/inventoryHelpers'
import Modal from '../../ui/Modal'
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

const emptyErrors = {
    product: '',
    account: '',
    quantity_bought: '',
    total_price: '',
    purchase_date: '',
}

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
    const [errors, setErrors] = useState(emptyErrors)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
    const [editFormData, setEditFormData] = useState<PurchaseFormState>(getInitialFormData)
    const [editPurchaseDatePreset, setEditPurchaseDatePreset] = useState<PurchaseDatePreset>('custom')
    const [editErrors, setEditErrors] = useState(emptyErrors)

    const updatePurchase = useUpdatePurchase({ purchaseId: editingPurchase?.id ?? 0 })

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
        setErrors(emptyErrors)
    }

    const resetEditForm = () => {
        setEditingPurchase(null)
        setEditFormData(getInitialFormData())
        setEditPurchaseDatePreset('custom')
        setEditErrors(emptyErrors)
    }

    const validateForm = (data: PurchaseFormState) => {
        const newErrors = { ...emptyErrors }
        let hasError = false

        if (!data.product) {
            newErrors.product = 'Selecciona un producto'
            hasError = true
        }
        if (!data.account) {
            newErrors.account = 'Selecciona una cuenta'
            hasError = true
        }
        if (!data.quantity_bought || data.quantity_bought <= 0) {
            newErrors.quantity_bought = 'La cantidad debe ser mayor a 0'
            hasError = true
        }
        if (!data.total_price || data.total_price <= 0) {
            newErrors.total_price = 'El precio total debe ser mayor a 0'
            hasError = true
        }
        if (!data.purchase_date) {
            newErrors.purchase_date = 'La fecha es requerida'
            hasError = true
        }

        return { errors: newErrors, isValid: !hasError }
    }

    const handleInputChange = (field: keyof PurchaseFormState, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors(validation.errors)
        if (!validation.isValid) return

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

    const handleEditInputChange = (field: keyof PurchaseFormState, value: string | number) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEdit = (purchase: Purchase) => {
        setEditingPurchase(purchase)
        setEditFormData(purchaseToFormState(purchase))
        setEditPurchaseDatePreset('custom')
        setEditErrors(emptyErrors)
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        resetEditForm()
    }

    const handleEditSubmit = () => {
        const validation = validateForm(editFormData)
        setEditErrors(validation.errors)
        if (!validation.isValid || !editingPurchase) return

        updatePurchase.mutate({ purchase: buildPurchasePayload(editFormData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Compra actualizada',
                    message: 'La compra se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar la compra',
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
                        onEdit={handleEdit}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal} width="max-w-4xl">
                <PurchaseForm
                    formData={editFormData}
                    errors={editErrors}
                    products={productItems}
                    accounts={accountItems}
                    purchaseDatePreset={editPurchaseDatePreset}
                    isSubmitting={updatePurchase.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onPurchaseDatePresetChange={setEditPurchaseDatePreset}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>
        </div>
    )
}

export default PurchaseMain
