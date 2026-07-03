import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import useGetKitchenTransactions from '../../../hooks/kitchen/transaction/useGetKitchenTransactions'
import useCreateKitchenTransaction from '../../../hooks/kitchen/transaction/useCreateKitchenTransaction'
import useUpdateKitchenTransaction from '../../../hooks/kitchen/transaction/useUpdateKitchenTransaction'
import useGetKitchenCategories from '../../../hooks/kitchen/category/useGetKitchenCategories'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { KitchenTransaction } from '../../../services/kitchen/transactionService'
import type {
    TransactionDatePreset,
    TransactionFormState,
    TransactionHistoryDatePreset,
} from '../../../utils/transactionHelpers'
import {
    buildTransactionListParams,
    buildTransactionPayload,
    getDefaultTransactionHistoryFilters,
    transactionToFormState,
} from '../../../utils/transactionHelpers'
import { filterFinanceCategories } from '../../../utils/categoryHelpers'
import { todayISO } from '../../../utils/inventoryHelpers'
import Modal from '../../ui/Modal'
import TransactionForm from './TransactionForm'
import TransactionHistoryFilters from './TransactionHistoryFilters'
import TransactionHistoryTable from './TransactionHistoryTable'

const getInitialFormData = (): TransactionFormState => ({
    transaction_type: 'E',
    account: 0,
    amount: 0,
    category: 0,
    description: '',
    transaction_date: todayISO(),
})

const emptyErrors = {
    account: '',
    amount: '',
    transaction_date: '',
}

const TransactionsMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetKitchenCategories({
        access,
        params: { menu_item: 'false' },
    })
    const createTransaction = useCreateKitchenTransaction()

    const [historyFilters, setHistoryFilters] = useState(getDefaultTransactionHistoryFilters)
    const transactionListParams = useMemo(
        () => buildTransactionListParams(historyFilters),
        [historyFilters],
    )

    const {
        data: transactions,
        isLoading: transactionsLoading,
        error: transactionsError,
    } = useGetKitchenTransactions({ access, params: transactionListParams })

    const [formData, setFormData] = useState<TransactionFormState>(getInitialFormData)
    const [transactionDatePreset, setTransactionDatePreset] = useState<TransactionDatePreset>('today')
    const [errors, setErrors] = useState(emptyErrors)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<KitchenTransaction | null>(null)
    const [editFormData, setEditFormData] = useState<TransactionFormState>(getInitialFormData)
    const [editTransactionDatePreset, setEditTransactionDatePreset] = useState<TransactionDatePreset>('custom')
    const [editErrors, setEditErrors] = useState(emptyErrors)

    const updateTransaction = useUpdateKitchenTransaction({
        transactionId: editingTransaction?.id ?? 0,
    })

    const isPageLoading = accountsLoading || categoriesLoading
    const pageError = accountsError || categoriesError

    const transactionItems = Array.isArray(transactions) ? transactions : []
    const accountItems = Array.isArray(accounts) ? accounts : []
    const activeAccounts = accountItems.filter(account => account.is_active)
    const financeCategories = useMemo(
        () => filterFinanceCategories(Array.isArray(categories) ? categories : []).filter(c => c.is_active),
        [categories],
    )
    const allFinanceCategories = Array.isArray(categories) ? categories : []

    useEffect(() => {
        if (!formData.account && activeAccounts.length > 0) {
            setFormData(prev => ({ ...prev, account: activeAccounts[0].id }))
        }
    }, [activeAccounts, formData.account])

    const handleHistoryDatePreset = (preset: TransactionHistoryDatePreset) => {
        setHistoryFilters(prev => ({
            ...prev,
            datePreset: preset,
            start_date: preset === 'custom' ? prev.start_date : '',
            end_date: preset === 'custom' ? prev.end_date : '',
        }))
    }

    const resetForm = () => {
        const defaultAccount = formData.account
        setFormData({
            ...getInitialFormData(),
            account: defaultAccount,
        })
        setTransactionDatePreset('today')
        setErrors(emptyErrors)
    }

    const resetEditForm = () => {
        setEditingTransaction(null)
        setEditFormData(getInitialFormData())
        setEditTransactionDatePreset('custom')
        setEditErrors(emptyErrors)
    }

    const validateForm = (data: TransactionFormState) => {
        const newErrors = { ...emptyErrors }
        let hasError = false

        if (!data.account) {
            newErrors.account = 'Selecciona una cuenta'
            hasError = true
        }
        if (!data.amount || data.amount <= 0) {
            newErrors.amount = 'El monto debe ser mayor a 0'
            hasError = true
        }
        if (!data.transaction_date) {
            newErrors.transaction_date = 'La fecha es requerida'
            hasError = true
        }

        return { errors: newErrors, isValid: !hasError }
    }

    const handleInputChange = (field: keyof TransactionFormState, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors(validation.errors)
        if (!validation.isValid) return

        createTransaction.mutate({ transaction: buildTransactionPayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Transacción registrada',
                    message: 'La transacción se registró correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al registrar la transacción',
                    type: 'error',
                })
            },
        })
    }

    const handleEditInputChange = (field: keyof TransactionFormState, value: string | number) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEdit = (transaction: KitchenTransaction) => {
        setEditingTransaction(transaction)
        setEditFormData(transactionToFormState(transaction))
        setEditTransactionDatePreset('custom')
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
        if (!validation.isValid || !editingTransaction) return

        updateTransaction.mutate({
            transaction: buildTransactionPayload(editFormData, { includeEmptyCategory: true }),
            access,
        }, {
            onSuccess: () => {
                addNotification({
                    title: 'Transacción actualizada',
                    message: 'La transacción se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar la transacción',
                    type: 'error',
                })
            },
        })
    }

    const editFinanceCategories = useMemo(() => {
        if (!editingTransaction?.category) return financeCategories
        const current = allFinanceCategories.find(c => c.id === editingTransaction.category)
        if (!current || financeCategories.some(c => c.id === current.id)) {
            return financeCategories
        }
        return [...financeCategories, current]
    }, [editingTransaction, financeCategories, allFinanceCategories])

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
                Error al cargar transacciones: {pageError.message}
            </div>
        )
    }

    const canCreateTransaction = activeAccounts.length > 0

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <ArrowLeftRight className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
                </motion.div>

                {canCreateTransaction ? (
                    <TransactionForm
                        formData={formData}
                        errors={errors}
                        accounts={activeAccounts}
                        categories={financeCategories}
                        transactionDatePreset={transactionDatePreset}
                        isSubmitting={createTransaction.isPending}
                        onInputChange={handleInputChange}
                        onTransactionDatePresetChange={setTransactionDatePreset}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                        <p>Crea una cuenta activa en Cuentas para poder registrar transacciones</p>
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
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                            {transactionsLoading ? '...' : transactionItems.length}
                        </span>
                    </div>

                    <TransactionHistoryFilters
                        filters={historyFilters}
                        categories={allFinanceCategories}
                        accounts={accountItems}
                        onFiltersChange={setHistoryFilters}
                        onDatePresetChange={handleHistoryDatePreset}
                    />

                    <TransactionHistoryTable
                        transactions={transactionItems}
                        categories={allFinanceCategories}
                        accounts={accountItems}
                        isLoading={transactionsLoading}
                        error={transactionsError}
                        onEdit={handleEdit}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal} width="max-w-4xl">
                <TransactionForm
                    formData={editFormData}
                    errors={editErrors}
                    accounts={accountItems}
                    categories={editFinanceCategories}
                    transactionDatePreset={editTransactionDatePreset}
                    isSubmitting={updateTransaction.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onTransactionDatePresetChange={setEditTransactionDatePreset}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>
        </div>
    )
}

export default TransactionsMain
