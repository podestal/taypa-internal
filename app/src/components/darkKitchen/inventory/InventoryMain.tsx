import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Boxes, Loader2, Search } from 'lucide-react'
import useGetCurrentStock from '../../../hooks/kitchen/inventory/useGetCurrentStock'
import useGetInventoryMovements from '../../../hooks/kitchen/inventory/useGetInventoryMovements'
import useGetInventoryReport from '../../../hooks/kitchen/inventory/useGetInventoryReport'
import useCreateInventoryMovement from '../../../hooks/kitchen/inventory/useCreateInventoryMovement'
import useGetProducts from '../../../hooks/kitchen/product/useGetProducts'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationStore from '../../../store/useNotificationStore'
import type { CreateInventoryMovement, MovementSource } from '../../../services/kitchen/inventoryService'
import type { InventoryReportParams } from '../../../services/kitchen/inventoryService'
import {
    todayISO,
    buildMovementListParams,
    getDefaultMovementHistoryFilters,
    type MovementHistoryDatePreset,
} from '../../../utils/inventoryHelpers'
import { buildIngredientStockItems, isIngredientProduct } from '../../../utils/productHelpers'
import CurrentStockList from './CurrentStockList'
import MovementForm from './MovementForm'
import MovementHistoryFilters from './MovementHistoryFilters'
import MovementList from './MovementList'
import InventoryReport from './InventoryReport'

const initialFormData: CreateInventoryMovement = {
    product: 0,
    movement_type: 'OUT',
    quantity: 0,
    source: 'USAGE',
    movement_date: todayISO(),
    notes: '',
}

const InventoryMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const addNotification = useNotificationStore(state => state.addNotification)

    const { data: currentStock, isLoading: stockLoading, error: stockError } = useGetCurrentStock({ access })
    const { data: products, isLoading: productsLoading } = useGetProducts({
        access,
        params: { include_all: 'true' },
    })
    const createMovement = useCreateInventoryMovement()

    const [movementFilters, setMovementFilters] = useState(getDefaultMovementHistoryFilters)
    const movementListParams = useMemo(
        () => buildMovementListParams(movementFilters),
        [movementFilters],
    )
    const {
        data: movements,
        isLoading: movementsLoading,
        error: movementsError,
    } = useGetInventoryMovements({ access, params: movementListParams })

    const [formData, setFormData] = useState<CreateInventoryMovement>(initialFormData)
    const [errors, setErrors] = useState({ product: '', quantity: '', movement_date: '' })
    const [stockSearch, setStockSearch] = useState('')
    const [reportParams, setReportParams] = useState<InventoryReportParams>({
        start_date: todayISO(),
        end_date: todayISO(),
    })

    const { data: report, isLoading: reportLoading, error: reportError } = useGetInventoryReport({
        access,
        params: reportParams,
        enabled: !!reportParams.start_date && !!reportParams.end_date,
    })

    const isLoading = stockLoading || productsLoading
    const error = stockError

    const stockItems = Array.isArray(currentStock) ? currentStock : []
    const movementItems = Array.isArray(movements) ? movements : []
    const ingredientProducts = useMemo(
        () => (Array.isArray(products) ? products : []).filter(isIngredientProduct),
        [products],
    )
    const ingredientProductIds = useMemo(
        () => new Set(ingredientProducts.map(product => product.id)),
        [ingredientProducts],
    )
    const ingredientStockItems = useMemo(
        () => buildIngredientStockItems(ingredientProducts, stockItems),
        [ingredientProducts, stockItems],
    )
    const filteredStockItems = useMemo(() => {
        const query = stockSearch.trim().toLowerCase()
        if (!query) return ingredientStockItems
        return ingredientStockItems.filter(item =>
            item.product_name.toLowerCase().includes(query),
        )
    }, [ingredientStockItems, stockSearch])
    const ingredientMovements = movementItems.filter(item => ingredientProductIds.has(item.product))
    const reportItems = Array.isArray(report) ? report : []
    const ingredientReportItems = reportItems.filter(item => ingredientProductIds.has(item.product_id))

    const handleMovementDatePreset = (preset: MovementHistoryDatePreset) => {
        setMovementFilters(prev => ({
            ...prev,
            datePreset: preset,
            start_date: preset === 'custom' ? prev.start_date : '',
            end_date: preset === 'custom' ? prev.end_date : '',
        }))
    }

    const resetForm = () => {
        setFormData(initialFormData)
        setErrors({ product: '', quantity: '', movement_date: '' })
    }

    const validateForm = () => {
        const newErrors = { product: '', quantity: '', movement_date: '' }
        let hasError = false

        if (!formData.product) {
            newErrors.product = 'Selecciona un producto'
            hasError = true
        }
        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = 'La cantidad debe ser mayor a 0'
            hasError = true
        }
        if (!formData.movement_date) {
            newErrors.movement_date = 'La fecha es requerida'
            hasError = true
        }

        setErrors(newErrors)
        return !hasError
    }

    const handleInputChange = (field: keyof CreateInventoryMovement, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field in errors && errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSourceChange = (source: MovementSource) => {
        setFormData(prev => ({
            ...prev,
            source,
            movement_type: source === 'ADJUSTMENT' ? prev.movement_type : 'OUT',
        }))
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        createMovement.mutate({ movement: formData, access }, {
            onSuccess: () => {
                addNotification({
                    title: 'Movimiento registrado',
                    message: 'El movimiento de inventario se registró correctamente',
                    type: 'success',
                })
                resetForm()
            },
            onError: () => {
                addNotification({
                    title: 'Error',
                    message: 'Error al registrar el movimiento',
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
                Error al cargar inventario: {error.message}
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
                    <Boxes className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Stock actual</h2>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                            {stockSearch.trim()
                                ? `${filteredStockItems.length} / ${ingredientStockItems.length}`
                                : ingredientStockItems.length}
                        </span>
                    </div>
                    {ingredientStockItems.length > 0 && (
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={stockSearch}
                                onChange={(e) => setStockSearch(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    <CurrentStockList
                        items={filteredStockItems}
                        emptyMessage={
                            stockSearch.trim()
                                ? 'No hay productos que coincidan con la búsqueda'
                                : ingredientProducts.length === 0
                                    ? 'Crea productos tipo ingrediente en Productos para ver el inventario'
                                    : 'No hay productos en inventario'
                        }
                    />
                </motion.div>

                {ingredientProducts.length > 0 && (
                    <MovementForm
                        formData={formData}
                        errors={errors}
                        products={ingredientProducts}
                        isSubmitting={createMovement.isPending}
                        onInputChange={handleInputChange}
                        onSourceChange={handleSourceChange}
                        onSubmit={handleSubmit}
                    />
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Movimientos</h2>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {ingredientMovements.length}
                        </span>
                    </div>
                    <MovementHistoryFilters
                        filters={movementFilters}
                        products={ingredientProducts}
                        onFiltersChange={setMovementFilters}
                        onDatePresetChange={handleMovementDatePreset}
                    />
                    <MovementList
                        movements={ingredientMovements}
                        products={ingredientProducts}
                        isLoading={movementsLoading}
                        error={movementsError}
                    />
                </motion.div>

                {ingredientProducts.length > 0 && (
                    <InventoryReport
                        report={ingredientReportItems}
                        products={ingredientProducts}
                        params={reportParams}
                        isLoading={reportLoading}
                        error={reportError}
                        onParamsChange={setReportParams}
                    />
                )}
            </div>
        </div>
    )
}

export default InventoryMain
