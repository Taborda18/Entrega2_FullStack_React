import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../../../store/cartStore";
import { subscribeToAuthChanges } from "../../../services/authService";
import { createCart } from "../../../services/cartService";
import { updateUser } from "../../../services/userService";
import { imageMap } from "../../../assets/imageMap";

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const total = getTotalPrice();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!loggedInUser) {
        setErrorMsg("Debes iniciar sesión para completar la compra");
        setLoading(false);
        return;
      }

      const userId = loggedInUser.uid || 1;

      // 1. Create cart in API
      const cartPayload = {
        userId: parseInt(userId),
        products: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const cartResult = await createCart(cartPayload);

      if (!cartResult.success) {
        setErrorMsg(`Error al crear el carrito: ${cartResult.error}`);
        setLoading(false);
        return;
      }

      // 2. Update user with checkout data (optional)
      const updateResult = await updateUser(parseInt(userId), {
        username: loggedInUser.name || formData.fullName,
        email: formData.email || loggedInUser.email,
        password: loggedInUser.password || "password",
        phone: formData.phone || "",
        address: formData.address,
      });

      // Clear local cart
      clearCart();
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/gallery");
      }, 3000);
    } catch (error) {
      setErrorMsg("Error al procesar la compra: " + error.message);
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-12 lg:ml-0"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="rounded-2xl border border-white/20 backdrop-blur-xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">¡Compra confirmada!</h2>
          <p className="text-white/60 mb-6">
            Tu carrito ha sido guardado en FakeStore API y tu perfil ha sido actualizado.
          </p>
          <p className="text-sm text-white/50 mb-6">
            Redirigiendo a la galería en 3 segundos...
          </p>
          <Link
            to="/gallery"
            className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all"
          >
            Volver a la galería
          </Link>
        </motion.div>
      </motion.section>
    );
  }

  if (items.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-12 lg:ml-0"
      >
        <div className="rounded-2xl border border-white/20 backdrop-blur-xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            No hay productos para pagar
          </h2>
          <p className="text-white/60 mb-6">Agrega productos al carrito antes de ir al checkout.</p>
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
      <h2 className="text-3xl font-black text-white mb-2">Checkout</h2>
      <p className="text-white/60 mb-6">Completa tus datos para finalizar la compra</p>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Forma */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/20 backdrop-blur-xl p-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h3 className="text-xl font-bold text-white">Datos del comprador</h3>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm"
            >
              {errorMsg}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Nombre completo</label>
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Dirección</label>
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle Principal 123, Apt 4B"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold hover:from-fuchsia-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/30"
          >
            {loading ? "Procesando..." : "Confirmar compra"}
          </motion.button>
        </motion.form>

        {/* Resumen */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/20 backdrop-blur-xl p-6 h-fit"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h3>
          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 pb-3 border-b border-white/10"
              >
                <img
                  src={imageMap[product.image] ?? product.image}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.title}</p>
                  <p className="text-xs text-white/60">{quantity}x ${Number(product.price).toFixed(2)}</p>
                </div>
                <p className="text-sm font-bold text-fuchsia-300">
                  ${(Number(product.price) * Number(quantity)).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-4 space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-fuchsia-300">${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
