import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import useGetToppings from '../../../hooks/kitchen/topping/useGetToppings'
import useCreateTopping from '../../../hooks/kitchen/topping/useCreateTopping'
import useUpdateTopping from '../../../hooks/kitchen/topping/useUpdateTopping'
import useDeactivateTopping from '../../../hooks/kitchen/topping/useDeactivateTopping'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { CreateKitchenTopping, KitchenTopping } from '../../../services/kitchen/toppingService'
import { buildToppingPayload, toppingToFormState } from '../../../utils/toppingHelpers'
import Modal from '../../ui/Modal'
import ToppingForm from './ToppingForm'
import ToppingList from './ToppingList'

const initialFormData: CreateKitchenTopping = {
    name: '',
    price: 0,
    product: 0,
    quantity: 0,
    is_active: true,
}

const emptyErrors = { name: '', price: '', product: '', quantity: '' }

const ToppingsMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)
    const { data: toppings, isLoading: toppingsLoading, error: toppingsError } = useGetToppings({ access })
    const { data: products, isLoading: productsLoading, error: productsError } = useGetProducts({ access })
    const createTopping = useCreateTopping()

    const [formData, setFormData] = useState<CreateKitchenTopping>(initialFormData)
    const [errors, setErrors] = useState(emptyErrors)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingTopping, setEditingTopping] = useState<KitchenTopping | null>(null)
    const [editFormData, setEditFormData] = useState<CreateKitchenTopping>(initialFormData)
    const [editErrors, setEditErrors] = useState(emptyErrors)
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedTopping, setSelectedTopping] = useState<KitchenTopping | null>(null)

    const updateTopping = useUpdateTopping({ toppingId: editingTopping?.id ?? 0 })
    const deactivateTopping = useDeactivateTopping({ toppingId: selectedTopping?.id ?? 0 })

    const isLoading = toppingsLoading || productsLoading
    const error = toppingsError || productsError

    const toppingItems = Array.isArray(toppings) ? toppings : []
    const productItems = Array.isArray(products) ? products : []
    const activeCount = toppingItems.filter(t => t.is_active).length

    const resetForm = () => {
        setFormData(initialFormData)
        setErrors(emptyErrors)
    }

    const resetEditForm = () => {
        setEditingTopping(null)
        setEditFormData(initialFormData)
        setEditErrors(emptyErrors)
    }

    const validateForm = (data: CreateKitchenTopping) => {
        const newErrors = { ...emptyErrors }
        let isValid = true

        if (!data.name.trim()) {
            newErrors.name = 'El nombre es requerido'
            isValid = false
        }
        if (!data.price || data.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0'
            isValid = false
        }
        if (!data.product) {
            newErrors.product = 'Selecciona un producto'
            isValid = false
        }
        if (!data.quantity || data.quantity <= 0) {
            newErrors.quantity = 'La cantidad debe ser mayor a 0'
            isValid = false
        }

        return { errors: newErrors, isValid }
    }

    const handleInputChange = (field: keyof CreateKitchenTopping, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors(validation.errors)
        if (!validation.isValid) return

        createTopping.mutate({ topping: buildToppingPayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Topping creado',
                    message: 'El topping se creó correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al crear el topping',
                    type: 'error',
                })
            },
        })
    }

    const handleEditInputChange = (field: keyof CreateKitchenTopping, value: string | number | boolean) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEdit = (topping: KitchenTopping) => {
        setEditingTopping(topping)
        setEditFormData(toppingToFormState(topping))
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
        if (!validation.isValid || !editingTopping) return

        updateTopping.mutate({ topping: buildToppingPayload(editFormData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Topping actualizado',
                    message: 'El topping se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar el topping',
                    type: 'error',
                })
            },
        })
    }

    const handleDeactivate = (topping: KitchenTopping) => {
        setSelectedTopping(topping)
        setShowDeactivateModal(true)
    }

    const confirmDeactivate = () => {
        if (!selectedTopping) return

        deactivateTopping.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Topping desactivado',
                    message: 'El topping fue desactivado correctamente',
                    type: 'success',
                })
                setShowDeactivateModal(false)
                setSelectedTopping(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al desactivar el topping',
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
                Error al cargar toppings: {error.message}
            </div>
        )
    }

    const canCreate = productItems.length > 0

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <Sparkles className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Toppings</h1>
                </motion.div>

                {canCreate ? (
                    <ToppingForm
                        formData={formData}
                        errors={errors}
                        products={productItems}
                        isSubmitting={createTopping.isPending}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                        <p>Crea productos primero para poder registrar toppings</p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Toppings registrados</h2>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                            {activeCount} activos
                        </span>
                    </div>
                    <ToppingList
                        toppings={toppingItems}
                        products={productItems}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivate}
                        deactivatingToppingId={deactivateTopping.isPending ? selectedTopping?.id ?? null : null}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal} width="max-w-3xl">
                <ToppingForm
                    formData={editFormData}
                    errors={editErrors}
                    products={productItems}
                    isSubmitting={updateTopping.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>

            <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Desactivar topping</h2>
                    <p className="text-gray-600">
                        ¿Desactivar el topping <strong>"{selectedTopping?.name}"</strong>?
                        No se eliminará, solo quedará inactivo.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            onClick={() => {
                                setShowDeactivateModal(false)
                                setSelectedTopping(null)
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            onClick={confirmDeactivate}
                            disabled={deactivateTopping.isPending}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {deactivateTopping.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{deactivateTopping.isPending ? 'Desactivando...' : 'Desactivar'}</span>
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ToppingsMain
