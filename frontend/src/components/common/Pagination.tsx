// WHAT: Reusable pagination component
// IMPORTS: @mui/material
// USED BY: ProductsPage, CustomerOrdersPage, AdminPages

import { Pagination as MuiPagination } from '@mui/material'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <MuiPagination
      page={page}
      count={totalPages}
      onChange={(_, value) => onChange(value)}
      color="primary"
      shape="rounded"
      sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
    />
  )
}

export default Pagination