import CollectionCarousel from "./CollectionCarousel";

export default function GalleryHero({ products }) {
  return (
    <div className="hero-panel relative overflow-hidden rounded-[2rem] border border-white/20 p-6 text-white sm:p-9">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative">
        <CollectionCarousel products={products} />
      </div>
    </div>
  );
}
