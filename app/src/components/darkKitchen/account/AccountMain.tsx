import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Loader2 } from 'lucide-react'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useCreateKitchenAccount from '../../../hooks/kitchen/account/useCreateKitchenAccount'
import useUpdateKitchenAccount from '../../../hooks/kitchen/account/useUpdateKitchenAccount'
import useDeactivateKitchenAccount from '../../../hooks/kitchen/account/useDeactivateKitchenAccount'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { CreateKitchenAccount, KitchenAccount } from '../../../services/kitchen/accountService'
import Modal from '../../ui/Modal'
import AccountForm from './AccountForm'
import AccountList from './AccountList'

const initialFormData: CreateKitchenAccount = {
    name: '',
    balance: 0,
    is_active: true,
}

const accountToFormState = (account: KitchenAccount): CreateKitchenAccount => ({
    name: account.name,
    balance: account.balance,
    is_active: account.is_active,
})

const AccountMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)
    const { data: accounts, isLoading, error } = useGetKitchenAccounts({ access })
    const createAccount = useCreateKitchenAccount()

    const [formData, setFormData] = useState<CreateKitchenAccount>(initialFormData)
    const [errors, setErrors] = useState({ name: '', balance: '' })
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingAccount, setEditingAccount] = useState<KitchenAccount | null>(null)
    const [editFormData, setEditFormData] = useState<CreateKitchenAccount>(initialFormData)
    const [editErrors, setEditErrors] = useState({ name: '', balance: '' })
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<KitchenAccount | null>(null)

    const updateAccount = useUpdateKitchenAccount({ accountId: editingAccount?.id ?? 0 })
    const deactivateAccount = useDeactivateKitchenAccount({
        accountId: selectedAccount?.id ?? 0,
    })

    const accountItems = Array.isArray(accounts) ? accounts : []
    const activeCount = accountItems.filter(a => a.is_active).length

    const resetForm = () => {
        setFormData(initialFormData)
        setErrors({ name: '', balance: '' })
    }

    const resetEditForm = () => {
        setEditingAccount(null)
        setEditFormData(initialFormData)
        setEditErrors({ name: '', balance: '' })
    }

    const validateForm = (data: CreateKitchenAccount) => {
        const newErrors = { name: '', balance: '' }
        let isValid = true

        if (!data.name.trim()) {
            newErrors.name = 'El nombre es requerido'
            isValid = false
        }
        if (data.balance < 0) {
            newErrors.balance = 'El saldo no puede ser negativo'
            isValid = false
        }

        return { errors: newErrors, isValid }
    }

    const handleInputChange = (field: keyof CreateKitchenAccount, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors(validation.errors)
        if (!validation.isValid) return

        createAccount.mutate({ account: formData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Cuenta creada',
                    message: 'La cuenta se creó correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al crear la cuenta',
                    type: 'error',
                })
            },
        })
    }

    const handleEditInputChange = (field: keyof CreateKitchenAccount, value: string | number | boolean) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEdit = (account: KitchenAccount) => {
        setEditingAccount(account)
        setEditFormData(accountToFormState(account))
        setEditErrors({ name: '', balance: '' })
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        resetEditForm()
    }

    const handleEditSubmit = () => {
        const validation = validateForm(editFormData)
        setEditErrors(validation.errors)
        if (!validation.isValid || !editingAccount) return

        updateAccount.mutate({ account: editFormData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Cuenta actualizada',
                    message: 'La cuenta se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar la cuenta',
                    type: 'error',
                })
            },
        })
    }

    const handleDeactivate = (account: KitchenAccount) => {
        setSelectedAccount(account)
        setShowDeactivateModal(true)
    }

    const confirmDeactivate = () => {
        if (!selectedAccount) return

        deactivateAccount.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Cuenta desactivada',
                    message: 'La cuenta fue desactivada correctamente',
                    type: 'success',
                })
                setShowDeactivateModal(false)
                setSelectedAccount(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al desactivar la cuenta',
                    type: 'error',
                })
            },
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                Error al cargar cuentas: {error.message}
            </div>
        )
    }

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <Wallet className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Cuentas</h1>
                </motion.div>

                <AccountForm
                    formData={formData}
                    errors={errors}
                    isSubmitting={createAccount.isPending}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Cuentas registradas</h2>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                            {activeCount} activas
                        </span>
                    </div>
                    <AccountList
                        accounts={accountItems}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivate}
                        deactivatingAccountId={deactivateAccount.isPending ? selectedAccount?.id ?? null : null}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal}>
                <AccountForm
                    formData={editFormData}
                    errors={editErrors}
                    isSubmitting={updateAccount.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>

            <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Desactivar cuenta</h2>
                    <p className="text-gray-600">
                        ¿Desactivar la cuenta <strong>"{selectedAccount?.name}"</strong>?
                        No se eliminará, solo quedará inactiva y no aparecerá en compras.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            onClick={() => {
                                setShowDeactivateModal(false)
                                setSelectedAccount(null)
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            onClick={confirmDeactivate}
                            disabled={deactivateAccount.isPending}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {deactivateAccount.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{deactivateAccount.isPending ? 'Desactivando...' : 'Desactivar'}</span>
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AccountMain
