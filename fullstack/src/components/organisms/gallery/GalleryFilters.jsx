import { motion } from "framer-motion";

export default function GalleryFilters({
  filteredCount,
  source,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  categories,
  selectedCategory,
  setSelectedCategory,
  resetPage,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="glass-panel mt-6 rounded-[1.7rem] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Catalogo</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900">Nuestros productos</h3>
          <p className="text-sm text-slate-500">
            {filteredCount} resultado(s) · fuente: {source === "api" ? "FakeStore API" : "Mock local"}
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[320px_180px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              resetPage();
            }}
            placeholder="Buscar por nombre, descripcion o categoria"
            className="input-luxe"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="input-luxe"
          >
            <option value="featured">Destacados</option>
            <option value="price-low">Menor precio</option>
            <option value="price-high">Mayor precio</option>
            <option value="rating">Mejor rating</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setSelectedCategory(category);
              resetPage();
            }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              selectedCategory === category
                ? "bg-slate-950 text-white"
                : "pill-action bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
