import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Loader2 } from 'lucide-react'
import useGetDishes from '../../../hooks/api/dish/useGetDishes'
import useGetCategories from '../../../hooks/api/category/useGetCategories'
import useCreateDish from '../../../hooks/api/dish/useCreateDish'
import useUpdateDish from '../../../hooks/api/dish/useUpdateDish'
import useDeleteDish from '../../../hooks/api/dish/useDeleteDish'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import Modal from '../../ui/Modal'
import DishesPageForm from './DishesPageForm'
import DishesPageList from './DishesPageList'
import type { Dish, CreateUpdateDish } from '../../../services/api/dishService'

const DishesPage = () => {
  const access = useAuthStore(state => state.access) || ''
  const addNotification = useNotificationStore(state => state.addNotification)
  const { data: dishes, isLoading: dishesLoading, error: dishesError } = useGetDishes({ access })
  const { data: categories, isLoading: categoriesLoading } = useGetCategories({ access })
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [formData, setFormData] = useState<CreateUpdateDish>({
    name: '',
    description: '',
    price: 0,
    category: 0,
    is_active: true
  })
  const [editFormData, setEditFormData] = useState<CreateUpdateDish>({
    name: '',
    description: '',
    price: 0,
    category: 0,
    is_active: true
  })
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category: ''
  })
  const [editErrors, setEditErrors] = useState({
    name: '',
    price: '',
    category: ''
  })
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null)

  const createDish = useCreateDish()
  const updateDish = useUpdateDish({ dishId: editingDish?.id || 0 })
  const deleteDish = useDeleteDish({ dishId: selectedDish?.id || 0 })

  // Filter dishes by selected category
  const filteredDishes = useMemo(() => {
    if (!dishes) return []
    if (selectedCategoryFilter === null) return dishes
    return dishes.filter(dish => dish.category === selectedCategoryFilter)
  }, [dishes, selectedCategoryFilter])

  // Separate validation for edit form
  const validateEditForm = () => {
    const newErrors = { name: '', price: '', category: '' }
    let hasError = false

    if (!editFormData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
      hasError = true
    }

    if (editFormData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
      hasError = true
    }

    if (!editFormData.category || editFormData.category === 0) {
      newErrors.category = 'La categoría es requerida'
      hasError = true
    }

    setEditErrors(newErrors)
    return !hasError
  }

  const handleEditInputChange = (field: keyof CreateUpdateDish, value: string | number | boolean) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
    if (editErrors[field as keyof typeof editErrors]) {
      setEditErrors(prev => ({ ...prev, [field as keyof typeof editErrors]: '' }))
    }
  }

  const handleEditSubmit = () => {
    if (!validateEditForm() || !editingDish) return

    updateDish.mutate({
      dish: editFormData,
      access
    }, {
      onSuccess: () => {
        addNotification({
          title: 'Plato actualizado',
          message: 'El plato ha sido actualizado correctamente',
          type: 'success'
        })
        setShowEditModal(false)
        setEditingDish(null)
        setEditFormData({
          name: '',
          description: '',
          price: 0,
          category: 0,
          is_active: true
        })
        setEditErrors({
          name: '',
          price: '',
          category: ''
        })
      },
      onError: () => {
        addNotification({
          title: 'Error',
          message: 'Error al actualizar el plato',
          type: 'error'
        })
      }
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 0,
      is_active: true
    })
    setErrors({
      name: '',
      price: '',
      category: ''
    })
    setEditingDish(null)
  }

  const validateForm = () => {
    const newErrors = { name: '', price: '', category: '' }
    let hasError = false

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
      hasError = true
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
      hasError = true
    }

    if (!formData.category || formData.category === 0) {
      newErrors.category = 'La categoría es requerida'
      hasError = true
    }

    setErrors(newErrors)
    return !hasError
  }

  const handleInputChange = (field: keyof CreateUpdateDish, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    createDish.mutate({
      dish: formData,
      access
    }, {
      onSuccess: () => {
        addNotification({
          title: 'Plato creado',
          message: 'El plato ha sido creado correctamente',
          type: 'success'
        })
        resetForm()
      },
      onError: () => {
        addNotification({
          title: 'Error',
          message: 'Error al crear el plato',
          type: 'error'
        })
      }
    })
  }

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish)
    setEditFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      is_active: dish.is_active
    })
    setEditErrors({
      name: '',
      price: '',
      category: ''
    })
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingDish(null)
    setEditFormData({
      name: '',
      description: '',
      price: 0,
      category: 0,
      is_active: true
    })
    setEditErrors({
      name: '',
      price: '',
      category: ''
    })
  }

  const handleDelete = (dish: Dish) => {
    setSelectedDish(dish)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!selectedDish) return

    deleteDish.mutate({ access }, {
      onSuccess: () => {
        addNotification({
          title: 'Plato eliminado',
          message: 'El plato ha sido eliminado correctamente',
          type: 'success'
        })
        setShowDeleteModal(false)
        setSelectedDish(null)
      },
      onError: () => {
        addNotification({
          title: 'Error',
          message: 'Error al eliminar el plato',
          type: 'error'
        })
      }
    })
  }

  if (dishesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (dishesError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error al cargar los platos: {dishesError.message}
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <UtensilsCrossed className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Platos</h1>
        </motion.div>

        {/* Create Form */}
        {categories && (
          <DishesPageForm
            formData={formData}
            errors={errors}
            isSubmitting={createDish.isPending}
            isEditing={false}
            categories={categories}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Category Filters */}
        {categories && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Filtrar por categoría:</span>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCategoryFilter === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Todos
                </motion.button>
                {categories
                .filter(category => category.is_menu_category)
                .map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategoryFilter(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedCategoryFilter === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dishes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold text-gray-900">Platos</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {filteredDishes.length}
            </span>
            {selectedCategoryFilter !== null && (
              <span className="text-sm text-gray-500">
                de {dishes?.length || 0} total
              </span>
            )}
          </div>
          {filteredDishes && categories && (
            <DishesPageList
              dishes={filteredDishes}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingDishId={deleteDish.isPending ? selectedDish?.id || null : null}
            />
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {categories && (
        <Modal isOpen={showEditModal} onClose={handleCloseEditModal} width="max-w-2xl">
          <DishesPageForm
            formData={editFormData}
            errors={editErrors}
            isSubmitting={updateDish.isPending}
            isEditing={true}
            categories={categories}
            onInputChange={handleEditInputChange}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEditModal}
            isModal={true}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Eliminar Plato</h2>
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar el plato <strong>"{selectedDish?.name}"</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3 pt-4">
            <motion.button
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedDish(null)
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={confirmDelete}
              disabled={deleteDish.isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {deleteDish.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{deleteDish.isPending ? 'Eliminando...' : 'Eliminar'}</span>
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DishesPage
