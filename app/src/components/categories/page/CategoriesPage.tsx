import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Tag, Loader2 } from 'lucide-react'
import useGetCategories from '../../../hooks/api/category/useGetCategories'
import useCreateCategory from '../../../hooks/api/category/useCreateCategory'
import useUpdateCategory from '../../../hooks/api/category/useUpdateCategory'
import useDeleteCategory from '../../../hooks/api/category/useDeleteCategory'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import Modal from '../../ui/Modal'
import CategoriesPageForm from './CategoriesPageForm'
import CategoriesPageList from './CategoriesPageList'
import type { Category, CreateUpdateCategory } from '../../../services/api/categoryService'

const CategoriesPage = () => {
  const access = useAuthStore(state => state.access) || ''
  const addNotification = useNotificationStore(state => state.addNotification)
  const { data: categories, isLoading, error } = useGetCategories({ access })
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CreateUpdateCategory>({
    name: '',
    description: '',
    is_active: true,
    is_menu_category: false
  })
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  })

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory({ categoryId: editingCategory?.id || 0 })
  const deleteCategory = useDeleteCategory({ categoryId: selectedCategory?.id || 0 })

  // Separate categories by menu_category
  const { menuCategories, nonMenuCategories } = useMemo(() => {
    if (!categories) return { menuCategories: [], nonMenuCategories: [] }
    
    return {
      menuCategories: categories.filter(cat => cat.is_menu_category),
      nonMenuCategories: categories.filter(cat => !cat.is_menu_category)
    }
  }, [categories])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      is_menu_category: false
    })
    setErrors({
      name: '',
      description: ''
    })
    setEditingCategory(null)
  }

  const validateForm = () => {
    const newErrors = { name: '', description: '' }
    let hasError = false

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
      hasError = true
    }

    setErrors(newErrors)
    return !hasError
  }

  const handleInputChange = (field: keyof CreateUpdateCategory, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingCategory) {
      updateCategory.mutate({
        category: formData,
        access
      }, {
        onSuccess: () => {
          addNotification({
            title: 'Categoría actualizada',
            message: 'La categoría ha sido actualizada correctamente',
            type: 'success'
          })
          resetForm()
        },
        onError: () => {
          addNotification({
            title: 'Error',
            message: 'Error al actualizar la categoría',
            type: 'error'
          })
        }
      })
    } else {
      createCategory.mutate({
        category: formData,
        access
      }, {
        onSuccess: () => {
          addNotification({
            title: 'Categoría creada',
            message: 'La categoría ha sido creada correctamente',
            type: 'success'
          })
          resetForm()
        },
        onError: () => {
          addNotification({
            title: 'Error',
            message: 'Error al crear la categoría',
            type: 'error'
          })
        }
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      is_menu_category: category.is_menu_category
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!selectedCategory) return

    deleteCategory.mutate({ access }, {
      onSuccess: () => {
        addNotification({
          title: 'Categoría eliminada',
          message: 'La categoría ha sido eliminada correctamente',
          type: 'success'
        })
        setShowDeleteModal(false)
        setSelectedCategory(null)
      },
      onError: () => {
        addNotification({
          title: 'Error',
          message: 'Error al eliminar la categoría',
          type: 'error'
        })
      }
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
        Error al cargar las categorías: {error.message}
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
          <Tag className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
        </motion.div>

        {/* Create/Edit Form */}
        <CategoriesPageForm
          formData={formData}
          errors={errors}
          isSubmitting={createCategory.isPending || updateCategory.isPending}
          isEditing={!!editingCategory}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* Menu Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold text-gray-900">Categorías de Menú</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {menuCategories.length}
            </span>
          </div>
          <CategoriesPageList
            categories={menuCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingCategoryId={deleteCategory.isPending ? selectedCategory?.id || null : null}
          />
        </motion.div>

        {/* Non-Menu Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold text-gray-900">Otras Categorías</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
              {nonMenuCategories.length}
            </span>
          </div>
          <CategoriesPageList
            categories={nonMenuCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingCategoryId={deleteCategory.isPending ? selectedCategory?.id || null : null}
          />
        </motion.div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Eliminar Categoría</h2>
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la categoría <strong>"{selectedCategory?.name}"</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex space-x-3 pt-4">
            <motion.button
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedCategory(null)
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={confirmDelete}
              disabled={deleteCategory.isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {deleteCategory.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{deleteCategory.isPending ? 'Eliminando...' : 'Eliminar'}</span>
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoriesPage
