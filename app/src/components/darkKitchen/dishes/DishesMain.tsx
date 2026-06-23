import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Loader2 } from 'lucide-react'
import useGetKitchenDishes from '../../../hooks/kitchen/dish/useGetKitchenDishes'
import useCreateKitchenDish from '../../../hooks/kitchen/dish/useCreateKitchenDish'
import useUpdateKitchenDish from '../../../hooks/kitchen/dish/useUpdateKitchenDish'
import useDeactivateKitchenDish from '../../../hooks/kitchen/dish/useDeactivateKitchenDish'
import useGetKitchenCategories from '../../../hooks/kitchen/category/useGetKitchenCategories'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { DishFormIngredient, DishFormState } from '../../../utils/dishHelpers'
import {
    buildDishPayload,
    dishToFormState,
    emptyIngredient,
    initialDishFormData,
} from '../../../utils/dishHelpers'
import Modal from '../../ui/Modal'
import DishForm from './DishForm'
import DishList from './DishList'

const emptyErrors = { name: '', price: '', category: '', ingredients: '' }

const DishesMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: dishes, isLoading: dishesLoading, error: dishesError } = useGetKitchenDishes({ access })
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetKitchenCategories({ access })
    const { data: products, isLoading: productsLoading, error: productsError } = useGetProducts({ access })
    const createDish = useCreateKitchenDish()

    const [formData, setFormData] = useState<DishFormState>(initialDishFormData)
    const [errors, setErrors] = useState(emptyErrors)

    const [showEditModal, setShowEditModal] = useState(false)
    const [editingDish, setEditingDish] = useState<KitchenDish | null>(null)
    const [editFormData, setEditFormData] = useState<DishFormState>(initialDishFormData)
    const [editErrors, setEditErrors] = useState(emptyErrors)

    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedDish, setSelectedDish] = useState<KitchenDish | null>(null)

    const updateDish = useUpdateKitchenDish({ dishId: editingDish?.id ?? 0 })
    const deactivateDish = useDeactivateKitchenDish({ dishId: selectedDish?.id ?? 0 })

    const isLoading = dishesLoading || categoriesLoading || productsLoading
    const error = dishesError || categoriesError || productsError

    const dishItems = Array.isArray(dishes) ? dishes : []
    const categoryItems = Array.isArray(categories) ? categories.filter(c => c.is_active) : []
    const productItems = Array.isArray(products) ? products : []
    const allCategories = Array.isArray(categories) ? categories : []
    const activeCount = dishItems.filter(d => d.is_active).length

    const editCategoryItems = useMemo(() => {
        if (!editingDish) return categoryItems
        const current = allCategories.find(c => c.id === editingDish.category)
        if (!current || categoryItems.some(c => c.id === current.id)) {
            return categoryItems
        }
        return [...categoryItems, current]
    }, [editingDish, categoryItems, allCategories])

    const validateFormData = (data: DishFormState) => {
        const newErrors = { ...emptyErrors }
        let hasError = false

        if (!data.name.trim()) {
            newErrors.name = 'El nombre es requerido'
            hasError = true
        }
        if (!data.price || data.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0'
            hasError = true
        }
        if (!data.category) {
            newErrors.category = 'Selecciona una categoría'
            hasError = true
        }

        const validIngredients = data.ingredients.filter(
            ing => ing.product > 0 && ing.quantity > 0
        )
        if (validIngredients.length === 0) {
            newErrors.ingredients = 'Agrega al menos un ingrediente válido'
            hasError = true
        }

        return { newErrors, hasError, validIngredients }
    }

    const resetForm = () => {
        setFormData(initialDishFormData)
        setErrors(emptyErrors)
    }

    const resetEditForm = () => {
        setEditFormData(initialDishFormData)
        setEditErrors(emptyErrors)
        setEditingDish(null)
    }

    const handleInputChange = (
        field: keyof Omit<DishFormState, 'ingredients'>,
        value: string | number | boolean
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleEditInputChange = (
        field: keyof Omit<DishFormState, 'ingredients'>,
        value: string | number | boolean
    ) => {
        setEditFormData(prev => ({ ...prev, [field]: value }))
        if (field in editErrors && editErrors[field as keyof typeof editErrors]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleIngredientChange = (index: number, field: keyof DishFormIngredient, value: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            ),
        }))
        if (errors.ingredients) setErrors(prev => ({ ...prev, ingredients: '' }))
    }

    const handleEditIngredientChange = (index: number, field: keyof DishFormIngredient, value: number) => {
        setEditFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            ),
        }))
        if (editErrors.ingredients) setEditErrors(prev => ({ ...prev, ingredients: '' }))
    }

    const handleAddIngredient = () => {
        setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }))
    }

    const handleEditAddIngredient = () => {
        setEditFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }))
    }

    const handleRemoveIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }))
    }

    const handleEditRemoveIngredient = (index: number) => {
        setEditFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = () => {
        const { newErrors, hasError } = validateFormData(formData)
        setErrors(newErrors)
        if (hasError) return

        createDish.mutate({ dish: buildDishPayload(formData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Plato creado',
                    message: 'El plato se creó correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al crear el plato',
                    type: 'error',
                })
            },
        })
    }

    const handleEdit = (dish: KitchenDish) => {
        setEditingDish(dish)
        setEditFormData(dishToFormState(dish))
        setEditErrors(emptyErrors)
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        resetEditForm()
    }

    const handleEditSubmit = () => {
        const { newErrors, hasError } = validateFormData(editFormData)
        setEditErrors(newErrors)
        if (hasError || !editingDish) return

        updateDish.mutate({ dish: buildDishPayload(editFormData), access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Plato actualizado',
                    message: 'El plato se actualizó correctamente',
                    type: 'success',
                })
                handleCloseEditModal()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al actualizar el plato',
                    type: 'error',
                })
            },
        })
    }

    const handleDeactivate = (dish: KitchenDish) => {
        setSelectedDish(dish)
        setShowDeactivateModal(true)
    }

    const confirmDeactivate = () => {
        if (!selectedDish) return

        deactivateDish.mutate({ access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Plato desactivado',
                    message: 'El plato fue desactivado correctamente',
                    type: 'success',
                })
                setShowDeactivateModal(false)
                setSelectedDish(null)
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al desactivar el plato',
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
                Error al cargar platos: {error.message}
            </div>
        )
    }

    const canCreate = categoryItems.length > 0 && productItems.length > 0

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <UtensilsCrossed className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Platos</h1>
                </motion.div>

                {canCreate ? (
                    <DishForm
                        formData={formData}
                        errors={errors}
                        products={productItems}
                        categories={categoryItems}
                        isSubmitting={createDish.isPending}
                        onInputChange={handleInputChange}
                        onIngredientChange={handleIngredientChange}
                        onAddIngredient={handleAddIngredient}
                        onRemoveIngredient={handleRemoveIngredient}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                        {categoryItems.length === 0 && <p>Crea categorías activas primero</p>}
                        {productItems.length === 0 && <p>Crea productos primero para definir ingredientes</p>}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Menú</h2>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                            {activeCount} activos
                        </span>
                    </div>
                    <DishList
                        dishes={dishItems}
                        categories={allCategories}
                        products={productItems}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivate}
                        deactivatingDishId={deactivateDish.isPending ? selectedDish?.id ?? null : null}
                    />
                </motion.div>
            </div>

            <Modal isOpen={showEditModal} onClose={handleCloseEditModal} width="max-w-3xl">
                <DishForm
                    formData={editFormData}
                    errors={editErrors}
                    products={productItems}
                    categories={editCategoryItems}
                    isSubmitting={updateDish.isPending}
                    isEditing
                    onInputChange={handleEditInputChange}
                    onIngredientChange={handleEditIngredientChange}
                    onAddIngredient={handleEditAddIngredient}
                    onRemoveIngredient={handleEditRemoveIngredient}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                />
            </Modal>

            <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Desactivar plato</h2>
                    <p className="text-gray-600">
                        ¿Desactivar el plato <strong>"{selectedDish?.name}"</strong>?
                        No se eliminará, solo quedará inactivo.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            onClick={() => {
                                setShowDeactivateModal(false)
                                setSelectedDish(null)
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            onClick={confirmDeactivate}
                            disabled={deactivateDish.isPending}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {deactivateDish.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{deactivateDish.isPending ? 'Desactivando...' : 'Desactivar'}</span>
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default DishesMain
