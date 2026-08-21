// WHAT: Responsive grid of ProductCards
// IMPORTS: ProductCard, @mui/material
// USED BY: ProductsPage.tsx, HomePage.tsx

import Grid from '@mui/material/Grid'
import ProductCard from './ProductCard'
import { Product } from '../../types'

interface Props {
  products: Product[]
}

const ProductGrid = ({ products }: Props) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductGrid