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
    <article className="group card-luxe card-hover-lift animate-fade-in">
      <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-white/70 via-transparent to-purple-500/20 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={`Mark ${product.title} as favorite`}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-lg shadow transition-all duration-300 hover:scale-110 ${
            isFavorite
              ? "bg-purple-600 text-white scale-110"
              : "bg-white/90 text-purple-600 hover:bg-purple-600 hover:text-white"
          }`}
        >
          ❤
        </button>
        <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-lg">
          <img
            src={resolvedImage}
            alt={product.title}
            className="h-48 w-full object-contain transition duration-500 group-hover:scale-110"
          />
        </Link>
      </div>

      <div className="relative px-2 pb-2 pt-4">
        <p className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {product.category ?? "General"}
        </p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900 hover:text-purple-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Price</p>
            <p className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{formatPrice(product.price)}</p>
          </div>
          <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            ★ {Number(product.rate ?? 0).toFixed(1)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="card-cta mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-600 hover:shadow-lg active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
