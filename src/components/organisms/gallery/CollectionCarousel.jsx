import { useEffect, useMemo, useState } from "react";
import { imageMap } from "../../../assets/imageMap";

const pickRandomItems = (items, count) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
};

export default function CollectionCarousel({ products }) {
  const slides = useMemo(() => pickRandomItems(products, Math.min(5, products.length)), [products]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2400);

    return () => window.clearInterval(timerId);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const sideSlides = slides.filter((_, index) => index !== activeIndex).slice(0, 2);

  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/25 bg-black/20 p-3 backdrop-blur">
      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
        Nuevos Productos
      </div>
      <div className="grid gap-2 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="relative h-40 overflow-hidden rounded-xl sm:h-48">
          {slides.map((product, index) => {
            const resolvedImage = imageMap[product.image] ?? product.image;
            return (
              <div
                key={product.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === activeIndex
                    ? "z-10 scale-100 opacity-100"
                    : "pointer-events-none scale-[1.02] opacity-0"
                }`}
              >
                <img
                  src={resolvedImage}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-lg bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white">
                  {product.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid h-40 grid-cols-2 gap-2 sm:h-48 sm:grid-cols-1">
          {sideSlides.map((product) => {
            const resolvedImage = imageMap[product.image] ?? product.image;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveIndex(slides.findIndex((slide) => slide.id === product.id))}
                className="group relative overflow-hidden rounded-xl border border-white/30"
              >
                <img
                  src={resolvedImage}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ver imagen ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
