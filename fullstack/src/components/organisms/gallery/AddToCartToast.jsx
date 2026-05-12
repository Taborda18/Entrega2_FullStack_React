export default function AddToCartToast({ productName }) {
  if (!productName) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-2xl backdrop-blur-xl">
      Agregado al carrito: <span className="font-black text-slate-950">{productName}</span>
    </div>
  );
}
