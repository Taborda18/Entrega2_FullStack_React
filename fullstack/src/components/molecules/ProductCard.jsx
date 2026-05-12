import { Link } from "react-router-dom";
import { useMemo } from "react";
import { imageMap } from "../../assets/imageMap";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));

function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }) {
  const resolvedImage = useMemo(
    () => imageMap[product.image] ?? product.image,
    [product.image],
  );

  return (
    <article className="card-luxe group">
      <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-white/70 via-transparent to-violet-100/40 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-slate-100 via-white to-violet-50 p-4">
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={`Marcar ${product.title} como favorito`}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-sm shadow transition ${
            isFavorite
              ? "bg-violet-600 text-white"
              : "bg-white/90 text-slate-600 hover:bg-violet-600 hover:text-white"
          }`}
        >
          ❤
        </button>
        <Link to={`/product/${product.id}`} className="block">
          <img
            src={resolvedImage}
            alt={product.title}
            className="h-48 w-full object-contain transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="relative px-1 pb-2 pt-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">
          {product.category ?? "General"}
        </p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="mt-1 line-clamp-1 text-lg font-black text-slate-900">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Precio</p>
            <p className="text-xl font-black text-slate-900">{formatPrice(product.price)}</p>
          </div>
          <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            ★ {Number(product.rate ?? 0).toFixed(1)}
            {product.ratingCount ? ` (${product.ratingCount})` : ""}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="card-cta mt-4 w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-violet-700"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
