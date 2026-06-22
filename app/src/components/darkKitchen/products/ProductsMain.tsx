import { useState } from 'react'
import { motion } from 'framer-motion'
import { PackageSearch, Loader2 } from 'lucide-react'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useCreateProduct from '../../../hooks/kitchen/product/useCreateProduct'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { CreateUpdateProduct } from '../../../services/kitchen/productService'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

const initialFormData: CreateUpdateProduct = {
    name: '',
    description: '',
    quantity: 0,
    weight: null,
    volume: null,
}

const ProductsMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)
    const { data: products, isLoading, error } = useGetProducts({ access })
    const createProduct = useCreateProduct()

    const [formData, setFormData] = useState<CreateUpdateProduct>(initialFormData)
    const [errors, setErrors] = useState({ name: '', quantity: '' })

    const resetForm = () => {
        setFormData(initialFormData)
        setErrors({ name: '', quantity: '' })
    }

    const validateForm = () => {
        const newErrors = { name: '', quantity: '' }
        let hasError = false

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido'
            hasError = true
        }

        if (formData.quantity < 0) {
            newErrors.quantity = 'La cantidad no puede ser negativa'
            hasError = true
        }

        setErrors(newErrors)
        return !hasError
    }

    const handleInputChange = (field: keyof CreateUpdateProduct, value: string | number | null) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'name' && errors.name) {
            setErrors(prev => ({ ...prev, name: '' }))
        }
        if (field === 'quantity' && errors.quantity) {
            setErrors(prev => ({ ...prev, quantity: '' }))
        }
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        createProduct.mutate({ product: formData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Producto creado',
                    message: 'El producto ha sido creado correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al crear el producto',
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
                Error al cargar los productos: {error.message}
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
                    <PackageSearch className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Inventario de Productos</h1>
                </motion.div>

                <ProductForm
                    formData={formData}
                    errors={errors}
                    isSubmitting={createProduct.isPending}
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
                        <h2 className="text-2xl font-semibold text-gray-900">Productos</h2>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {products?.length ?? 0}
                        </span>
                    </div>
                    <ProductList products={products ?? []} />
                </motion.div>
            </div>
        </div>
    )
}

export default ProductsMain
