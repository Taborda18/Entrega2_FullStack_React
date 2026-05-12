export const ITEMS_PER_PAGE = 8;

export const sortProducts = (productList, sortBy) => {
  if (sortBy === "price-low") {
    return [...productList].sort((a, b) => Number(a.price) - Number(b.price));
  }
  if (sortBy === "price-high") {
    return [...productList].sort((a, b) => Number(b.price) - Number(a.price));
  }
  if (sortBy === "rating") {
    return [...productList].sort((a, b) => Number(b.rate) - Number(a.rate));
  }
  return [...productList].sort((a, b) => Number(a.id) - Number(b.id));
};

export const filterProducts = (productList, searchTerm, selectedCategory) => {
  const normalized = searchTerm.trim().toLowerCase();
  return productList.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const searchable = `${product.title} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && searchable.includes(normalized);
  });
};
