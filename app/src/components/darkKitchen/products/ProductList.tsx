import type { Product } from '../../../services/kitchen/productService'
import ProductCard from './ProductCard'

interface Props {
    products: Product[]
}

const ProductList = ({ products }: Props) => {
    if (products.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay productos registrados</p>
                <p className="text-sm mt-1">Crea el primero usando el formulario de arriba</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    )
}

export default ProductList
