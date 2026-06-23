import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Loader2 } from 'lucide-react'
import useGetKitchenCategories from '../../../hooks/kitchen/category/useGetKitchenCategories'
import useCreateKitchenCategory from '../../../hooks/kitchen/category/useCreateKitchenCategory'
import useUpdateKitchenCategory from '../../../hooks/kitchen/category/useUpdateKitchenCategory'
import useDeactivateKitchenCategory from '../../../hooks/kitchen/category/useDeactivateKitchenCategory'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { CreateKitchenCategory, KitchenCategory } from '../../../services/kitchen/categoryService'
import Modal from '../../ui/Modal'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

const initialFormData: CreateKitchenCategory = {
    name: '',
    description: '',
    is_active: true,
}

const categoryToFormState = (category: KitchenCategory): CreateKitchenCategory => ({
    name: category.name,
    description: category.description,
    is_active: category.is_active,
})

const CategoriesMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)
    const { data: categories, isLoading, error } = useGetKitchenCategories({ access })
    const createCategory = useCreateKitchenCategory()

    const [formData, setFormData] = useState<CreateKitchenCategory>(initialFormData)
    const [errors, setErrors] = useState({ name: '' })
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<KitchenCategory | null>(null)
    const [editFormData, setEditFormData] = useState<CreateKitchenCategory>(initialFormData)
    const [editErrors, setEditErrors] = useState({ name: '' })
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<KitchenCategory | null>(null)

    const updateCategory = useUpdateKitchenCategory({ categoryId: editingCategory?.id ?? 0 })
    const deactivateCategory = useDeactivateKitchenCategory({
        categoryId: selectedCategory?.id ?? 0,
    })

    const categoryItems = Array.isArray(categories) ? categories : []
    const activeCount = categoryItems.filter(c => c.is_active).length

    const resetForm = () => {
        setFormData(initialFormData)
        setErrors({ name: '' })
    }

    const resetEditForm = () => {
        setEditingCategory(null)
        setEditFormData(initialFormData)
        setEditErrors({ name: '' })
    }

    const validateForm = (data: CreateKitchenCategory) => {
        if (!data.name.trim()) {
            return { name: 'El nombre es requerido', isValid: false }
        }
        return { name: '', isValid: true }
    }

    const handleInputChange = (field: keyof CreateKitchenCategory, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'name' && errors.name) {
            setErrors({ name: '' })
        }
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors({ name: validation.name })
        if (!validation.isValid) return

        createCategory.mutate({ category: formData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Categoría creada',
                    message: 'La categoría se creó correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al crear la categoría',
                    type: 'error',
                })
            },
        })
    }

    const handleEditInputChange = (field: keyof CreateKitchenCategory, value: string | boolean) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'name' && editErrors.name) {
            setEditErrors({ name: '' })
        }
    }

    const handleEdit = (category: KitchenCategory) => {
        setEditingCategory(category)
        setEditFormData(categoryToFormState(category))
        setEditErrors({ name: '' })
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        resetEditForm()
    }

    const handleEditSubmit = () => {
        const validation = validateForm(editFormData)
        setEditErrors({ name: validation.name })
        if (!validation.isValid || !editingCategory) return

        updateCategory.mutate({ category: editFormData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Categoría actualizada',
                    message: 'La categoría se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar la categoría',
                    type: 'error',
                })
            },
        })
    }

    const handleDeactivate = (category: KitchenCategory) => {
        setSelectedCategory(category)
        setShowDeactivateModal(true)
    }

    const confirmDeactivate = () => {
        if (!selectedCategory) return

        deactivateCategory.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Categoría desactivada',
                    message: 'La categoría fue desactivada correctamente',
                    type: 'success',
                })
                setShowDeactivateModal(false)
                setSelectedCategory(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al desactivar la categoría',
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
                Error al cargar categorías: {error.message}
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
                    <Tag className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                </motion.div>

                <CategoryForm
                    formData={formData}
                    errors={errors}
                    isSubmitting={createCategory.isPending}
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
                        <h2 className="text-2xl font-semibold text-gray-900">Categorías registradas</h2>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {activeCount} activas
                        </span>
                    </div>
                    <CategoryList
                        categories={categoryItems}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivate}
                        deactivatingCategoryId={deactivateCategory.isPending ? selectedCategory?.id ?? null : null}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal}>
                <CategoryForm
                    formData={editFormData}
                    errors={editErrors}
                    isSubmitting={updateCategory.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>

            <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Desactivar categoría</h2>
                    <p className="text-gray-600">
                        ¿Desactivar la categoría <strong>"{selectedCategory?.name}"</strong>?
                        No se eliminará, solo quedará inactiva.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            onClick={() => {
                                setShowDeactivateModal(false)
                                setSelectedCategory(null)
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            onClick={confirmDeactivate}
                            disabled={deactivateCategory.isPending}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {deactivateCategory.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{deactivateCategory.isPending ? 'Desactivando...' : 'Desactivar'}</span>
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CategoriesMain
