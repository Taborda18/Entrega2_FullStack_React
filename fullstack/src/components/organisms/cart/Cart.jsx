import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useCartStore from "../../../store/cartStore";
import { subscribeToAuthChanges } from "../../../services/authService";
import { imageMap } from "../../../assets/imageMap";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const updateCartOnAPI = useCartStore((state) => state.updateCartOnAPI);
  const syncCartToAPI = useCartStore((state) => state.syncCartToAPI);
  const apiCartId = useCartStore((state) => state.apiCartId);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const total = getTotalPrice();

  const handleQuantityChange = async (productId, action) => {
    if (action === "increment") {
      incrementItem(productId);
    } else if (action === "decrement") {
      decrementItem(productId);
    } else if (action === "remove") {
      removeItem(productId);
    }

    // Sync to API if user is logged in and cart exists
    if (loggedInUser && apiCartId) {
      try {
        const result = await updateCartOnAPI(apiCartId, loggedInUser.uid || 1);
        if (result.success) {
          setSyncMessage("✓ Carrito sincronizado");
          setTimeout(() => setSyncMessage(""), 2000);
        }
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    }
  };

  const handleSyncCart = async () => {
    if (!loggedInUser) {
      setSyncMessage("❌ Debes iniciar sesión primero");
      return;
    }

    setLoading(true);
    try {
      const userId = loggedInUser.uid || 1;
      const result = await syncCartToAPI(userId);

      if (result.success) {
        setSyncMessage(`✓ Carrito guardado con ID: ${result.cartId}`);
        setTimeout(() => setSyncMessage(""), 3000);
      } else {
        setSyncMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setSyncMessage("❌ Error al sincronizar");
      console.error("Sync error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-12 lg:ml-0"
      >
        <div className="rounded-2xl border border-white/20 backdrop-blur-xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-white/60 mb-6">
            Agrega productos desde la galería para iniciar la compra.
          </p>
          <Link
            to="/gallery"
            className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all"
          >
            Ir a productos
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 lg:ml-0"
    >
      <h2 className="text-3xl font-black text-white mb-2">Carrito de Compras</h2>
      <p className="text-white/60 mb-6">{items.length} artículos</p>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/20 backdrop-blur-xl divide-y divide-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          {items.map(({ product, quantity }, index) => {
            const resolvedImage = imageMap[product.image] ?? product.image;
            const itemSubtotal = Number(product.price) * Number(quantity);
            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 flex gap-4 items-start"
              >
                <img
                  src={resolvedImage}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{product.title}</h3>
                  <p className="text-sm text-white/60">${Number(product.price).toFixed(2)} c/u</p>
                  <p className="text-sm font-semibold text-fuchsia-300 mt-1">
                    Subtotal: ${itemSubtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleQuantityChange(product.id, "decrement")}
                    className="w-8 h-8 rounded-lg border border-white/30 hover:bg-white/10 text-white font-semibold transition-all"
                  >
                    −
                  </motion.button>
                  <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleQuantityChange(product.id, "increment")}
                    className="w-8 h-8 rounded-lg border border-white/30 hover:bg-white/10 text-white font-semibold transition-all"
                  >
                    +
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleQuantityChange(product.id, "remove")}
                  className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  ✕
                </motion.button>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Resumen */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/20 backdrop-blur-xl p-6 h-fit"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Resumen</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-white/70">
              <span>Productos</span>
              <span>{items.length}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-3">
              <span>Total</span>
              <span className="text-fuchsia-300">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Sync to API Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSyncCart}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-all disabled:opacity-50 mb-4"
          >
            {loading ? "Guardando..." : "💾 Guardar en API"}
          </motion.button>

          {syncMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center text-white/70 mb-4 p-2 bg-white/5 rounded"
            >
              {syncMessage}
            </motion.p>
          )}

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="block w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-center hover:from-fuchsia-600 hover:to-pink-600 transition-all shadow-lg shadow-fuchsia-500/30"
          >
            Proceder a Checkout →
          </Link>
        </motion.aside>
      </div>
    </motion.section>
  );
}
