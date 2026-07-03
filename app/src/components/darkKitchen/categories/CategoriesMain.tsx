import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Loader2 } from 'lucide-react'
import useGetKitchenCategories from '../../../hooks/kitchen/category/useGetKitchenCategories'
import useCreateKitchenCategory from '../../../hooks/kitchen/category/useCreateKitchenCategory'
import useUpdateKitchenCategory from '../../../hooks/kitchen/category/useUpdateKitchenCategory'
import useDeactivateKitchenCategory from '../../../hooks/kitchen/category/useDeactivateKitchenCategory'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import {
    buildCategoryCreatePayload,
    buildCategoryListParams,
    buildCategoryUpdatePayload,
    categoryToFormState,
    validateCategoryForm,
    CATEGORY_MENU_ITEM_FILTERS,
    initialCategoryFormData,
    type CategoryFormState,
    type CategoryMenuItemFilter,
} from '../../../utils/categoryHelpers'
import Modal from '../../ui/Modal'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

const CategoriesMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)
    const [menuItemFilter, setMenuItemFilter] = useState<CategoryMenuItemFilter>('all')
    const categoryListParams = useMemo(
        () => buildCategoryListParams(menuItemFilter),
        [menuItemFilter],
    )
    const { data: categories, isLoading, error } = useGetKitchenCategories({
        access,
        params: categoryListParams,
    })
    const createCategory = useCreateKitchenCategory()

    const [formData, setFormData] = useState<CategoryFormState>(() => initialCategoryFormData())
    const [errors, setErrors] = useState({ name: '', description: '' })
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<KitchenCategory | null>(null)
    const [editFormData, setEditFormData] = useState<CategoryFormState>(() => initialCategoryFormData())
    const [editErrors, setEditErrors] = useState({ name: '', description: '' })
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<KitchenCategory | null>(null)

    const updateCategory = useUpdateKitchenCategory({ categoryId: editingCategory?.id ?? 0 })
    const deactivateCategory = useDeactivateKitchenCategory({
        categoryId: selectedCategory?.id ?? 0,
    })

    const categoryItems = Array.isArray(categories) ? categories : []
    const activeCount = categoryItems.filter(c => c.is_active).length
    const menuCount = categoryItems.filter(c => c.menu_item).length
    const financeCount = categoryItems.filter(c => !c.menu_item).length

    const resetForm = () => {
        setFormData({
            ...initialCategoryFormData(),
            menu_item: menuItemFilter === 'finance' ? false : true,
        })
        setErrors({ name: '', description: '' })
    }

    const resetEditForm = () => {
        setEditingCategory(null)
        setEditFormData(initialCategoryFormData())
        setEditErrors({ name: '', description: '' })
    }

    const validateForm = validateCategoryForm

    const handleInputChange = (field: keyof CategoryFormState, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleMenuItemTypeChange = (isMenu: boolean) => {
        setFormData(prev => ({
            ...prev,
            menu_item: isMenu,
            description: isMenu ? '' : prev.description,
        }))
        setErrors(prev => ({ ...prev, description: '' }))
    }

    const handleMenuItemFilterChange = (filter: CategoryMenuItemFilter) => {
        setMenuItemFilter(filter)
        setFormData(prev => ({
            ...prev,
            menu_item: filter === 'finance' ? false : filter === 'menu' ? true : prev.menu_item,
        }))
    }

    const handleSubmit = () => {
        const validation = validateForm(formData)
        setErrors(validation.errors)
        if (!validation.isValid) return

        createCategory.mutate({ category: buildCategoryCreatePayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Categoría creada',
                    message: 'La categoría se creó correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : 'Error al crear la categoría'
                addNotification({
                    title: 'Error',
                    message,
                    type: 'error',
                })
            },
        })
    }

    const handleEditInputChange = (field: keyof CategoryFormState, value: string | boolean) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEditMenuItemTypeChange = (isMenu: boolean) => {
        setEditFormData(prev => ({
            ...prev,
            menu_item: isMenu,
            description: isMenu ? '' : prev.description,
        }))
        setEditErrors(prev => ({ ...prev, description: '' }))
    }

    const handleEdit = (category: KitchenCategory) => {
        setEditingCategory(category)
        setEditFormData(categoryToFormState(category))
        setEditErrors({ name: '', description: '' })
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        resetEditForm()
    }

    const handleEditSubmit = () => {
        const validation = validateForm(editFormData)
        setEditErrors(validation.errors)
        if (!validation.isValid || !editingCategory) return

        updateCategory.mutate({ category: buildCategoryUpdatePayload(editFormData), access }, {
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
                    onMenuItemTypeChange={handleMenuItemTypeChange}
                    onSubmit={handleSubmit}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-2xl font-semibold text-gray-900">Categorías registradas</h2>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {activeCount} activas
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_MENU_ITEM_FILTERS.map(filter => (
                                <motion.button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => handleMenuItemFilterChange(filter.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        menuItemFilter === filter.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {filter.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {menuItemFilter === 'all' && (
                        <p className="text-sm text-gray-500">
                            {menuCount} de menú · {financeCount} de finanzas
                        </p>
                    )}

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
                    onMenuItemTypeChange={handleEditMenuItemTypeChange}
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
