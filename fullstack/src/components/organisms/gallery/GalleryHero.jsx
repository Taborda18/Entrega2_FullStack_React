import CollectionCarousel from "./CollectionCarousel";
import { motion } from "framer-motion";

export default function GalleryHero({ products }) {
  return (
    <div className="hero-panel relative overflow-hidden rounded-[2rem] border border-white/20 p-6 text-white sm:p-9">
      <div className="hero-glow absolute -left-16 top-8 h-40 w-40 rounded-full bg-fuchsia-300/25 blur-3xl" />
      <div className="hero-glow absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_0)] [background-size:18px_18px]" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mb-4"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-100">Luxury Collection</p>
        <h2 className="mt-2 text-2xl font-black sm:text-3xl">Nuevos lanzamientos seleccionados</h2>
        <p className="mt-1 text-sm text-violet-100/90">Inspirado en tendencias premium y productos top de temporada.</p>
      </motion.div>
      <div className="relative">
        <CollectionCarousel products={products} />
      </div>
    </div>
  );
}
