import { motion } from 'framer-motion'
import { Package, Scale, Droplets, Hash } from 'lucide-react'
import type { Product } from '../../../services/kitchen/productService'

interface Props {
    product: Product
    index: number
}

const formatDecimal = (value: number | null) => {
    if (value === null || value === undefined) return '—'
    return Number(value).toLocaleString('es-PE', { maximumFractionDigits: 2 })
}

const ProductCard = ({ product, index }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    {product.description ? (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1 italic">Sin descripción</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Hash className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Cantidad</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{formatDecimal(product.quantity)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Scale className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Peso</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{formatDecimal(product.weight)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Droplets className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Volumen</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{formatDecimal(product.volume)}</p>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard
