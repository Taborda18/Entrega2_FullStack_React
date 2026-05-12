import { Link } from "react-router-dom";
import useCartStore from "../../../store/cartStore";
import { imageMap } from "../../../assets/imageMap";

export default function Cart() {
  // TODO ESTUDIANTE: agregar cupones, envio y resumen con impuestos.
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <div className="bg-white/95 backdrop-blur rounded-2xl border border-purple-200 p-10 text-center shadow-lg">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add products from the gallery to start shopping.
          </p>
          <Link
            to="/gallery"
            className="inline-flex px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white/95 backdrop-blur rounded-2xl border border-purple-200 divide-y divide-purple-100 shadow-lg overflow-hidden">
          {items.map(({ product, quantity }, index) => {
            const resolvedImage = imageMap[product.image] ?? product.image;
            const itemSubtotal = Number(product.price) * Number(quantity);
            return (
              <article 
                key={product.id} 
                className="p-4 flex gap-4 items-center hover:bg-purple-50/50 transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={resolvedImage}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate hover:text-purple-600 transition-colors">{product.title}</h3>
                  <p className="text-sm text-gray-600">${Number(product.price).toFixed(2)} each</p>
                  <p className="text-sm font-semibold text-purple-600 mt-1">
                    Subtotal: ${itemSubtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => decrementItem(product.id)}
                    className="w-8 h-8 rounded border border-purple-300 hover:bg-purple-200 hover:text-purple-700 transition-all duration-300 font-semibold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(product.id)}
                    className="w-8 h-8 rounded border border-purple-300 hover:bg-purple-200 hover:text-purple-700 transition-all duration-300 font-semibold"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-all duration-300 font-medium"
                >
                  Remove
                </button>
              </article>
            );
          })}
        </div>

        <aside className="bg-white/95 backdrop-blur rounded-2xl border border-purple-200 p-6 h-fit shadow-lg sticky top-20">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">Order Summary</h3>
          
          <div className="space-y-3 mb-6 pb-6 border-b border-purple-100">
            <div className="flex justify-between text-gray-600">
              <span>Products</span>
              <span className="font-semibold text-gray-900">{items.length}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <span>Total</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full inline-flex justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
