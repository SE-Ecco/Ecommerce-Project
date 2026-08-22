// WHAT: Reusable search input with search button
// IMPORTS: @mui/material
// USED BY: ProductsPage, AdminUsers, AdminShops

import { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface Props {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar = ({ placeholder = 'Search...', onSearch }: Props) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => onSearch(query)

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <TextField
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default SearchBar