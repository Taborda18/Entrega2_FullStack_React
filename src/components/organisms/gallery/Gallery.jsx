import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../molecules/ProductCard";
import { getProducts } from "../../../services/productService";
import useCartStore from "../../../store/cartStore";
import AddToCartToast from "./AddToCartToast";
import GalleryFilters from "./GalleryFilters";
import GalleryHero from "./GalleryHero";
import GalleryPagination from "./GalleryPagination";
import { filterProducts, ITEMS_PER_PAGE, sortProducts } from "./galleryUtils";

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastAdded, setLastAdded] = useState(null);
  const toastTimerRef = useRef(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((product) => product.category))).filter(
      Boolean,
    );
    return ["Todos", ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result = filterProducts(products, searchTerm, selectedCategory);
    return sortProducts(result, sortBy);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setLastAdded(product.title);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setLastAdded(null), 1600);
  };

  useEffect(
    () => () => {
      window.clearTimeout(toastTimerRef.current);
    },
    [],
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 text-sm font-semibold text-slate-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AddToCartToast productName={lastAdded} />
      <GalleryHero products={products} />
      <GalleryFilters
        filteredCount={filteredProducts.length}
        source={products[0]?.source ?? "mock"}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resetPage={() => setCurrentPage(1)}
      />

      {filteredProducts.length === 0 ? (
        <div className="glass-panel mt-6 rounded-[1.7rem] p-10 text-center">
          <h3 className="text-xl font-black text-slate-900">No encontramos productos</h3>
          <p className="mt-2 text-sm text-slate-500">Prueba otra busqueda o selecciona otra categoria.</p>
        </div>
      ) : (
        <>
          <div className="product-grid mt-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <GalleryPagination
            visibleCount={visibleProducts.length}
            filteredCount={filteredProducts.length}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </>
      )}
    </section>
  );
}
