export default function GalleryPagination({
  visibleCount,
  filteredCount,
  totalPages,
  currentPage,
  onPageChange,
}) {
  return (
    <div className="glass-panel mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl p-3 sm:justify-between">
      <p className="text-sm font-semibold text-slate-500">
        Mostrando {visibleCount} de {filteredCount}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pill-action bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 rounded-xl px-2 text-sm font-black ${
              page === currentPage
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pill-action bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
