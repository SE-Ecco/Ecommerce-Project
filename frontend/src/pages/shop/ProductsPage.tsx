// WHAT: All products of ONE shop with category filter + search + pagination
// IMPORTS: services/productService, services/shopService, services/categoryService
//          store/shopStore, components/product/ProductGrid, components/common/{Spinner, Pagination, SearchBar}
// FLOW: read :slug from URL → load shop → load categories → load products → render grid
