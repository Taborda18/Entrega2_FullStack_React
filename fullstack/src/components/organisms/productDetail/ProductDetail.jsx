import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById } from '../../../services/productService';
import { imageMap } from '../../../assets/imageMap';
import useCartStore from '../../../store/cartStore';
import { subscribeToAuthChanges } from '../../../services/authService';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [syncMessage, setSyncMessage] = useState("");

  const addItem = useCartStore((state) => state.addItem);
  const syncCartToAPI = useCartStore((state) => state.syncCartToAPI);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async () => {
    addItem(product, quantity);
    setAdded(true);
    setSyncMessage("✓ Producto agregado al carrito");

    // Auto-sync to API if logged in
    if (loggedInUser) {
      try {
        const userId = loggedInUser.uid || 1;
        const result = await syncCartToAPI(userId);
        if (result.success) {
          setSyncMessage(`✓ Sincronizado con API (ID: ${result.cartId})`);
        }
      } catch (error) {
        console.error("Auto-sync error:", error);
      }
    }

    setTimeout(() => {
      setAdded(false);
      setSyncMessage("");
    }, 2500);
  };

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rate) ? 'text-yellow-400' : 'text-white/20'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen lg:ml-0"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500"></div>
          <p className="text-white/60">Cargando producto...</p>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-screen gap-4 lg:ml-0 px-4"
      >
        <p className="text-xl text-white/70">Producto no encontrado.</p>
        <button
          onClick={() => navigate('/gallery')}
          className="px-6 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:from-fuchsia-600 hover:to-pink-600 transition-all"
        >
          Volver a la galería
        </button>
      </motion.div>
    );
  }

  const resolvedImage = imageMap[product.image] ?? product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8 lg:ml-0"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate('/gallery')}
        className="flex items-center gap-2 text-white/60 hover:text-fuchsia-400 transition-colors mb-8 group font-semibold"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la galería
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        <div className="lg:flex">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 relative h-96 lg:h-auto overflow-hidden"
          >
            <img
              src={resolvedImage}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg"
            >
              ✨ DESTACADO
            </motion.div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-black text-white mb-3"
              >
                {product.title}
              </motion.h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="text-2xl">{renderStars(product.rate)}</div>
                <span className="text-sm text-white/60">
                  <span className="text-white font-bold">{product.rate}</span> / 5
                  {product.ratingCount && ` • ${product.ratingCount} reseñas`}
                </span>
              </motion.div>

              {/* Categoría */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4 inline-block"
              >
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold">
                  {product.category}
                </span>
              </motion.div>

              {/* Precio */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-5xl font-black bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent mb-6"
              >
                ${Number(product.price).toFixed(2)}
              </motion.p>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 leading-relaxed mb-8 text-lg"
              >
                {product.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="space-y-4"
            >
              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white/70 uppercase tracking-wide">Cantidad:</span>
                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-white/5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all font-bold text-lg"
                  >
                    −
                  </motion.button>
                  <span className="w-12 text-center font-bold text-white">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all font-bold text-lg"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to cart button */}
              <motion.button
                whileHover={!added ? { scale: 1.02 } : {}}
                whileTap={!added ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${
                  added
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
                    : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 shadow-fuchsia-500/30 active:scale-95'
                }`}
              >
                {added ? '✓ ¡Agregado al carrito!' : '🛒 Agregar al carrito'}
              </motion.button>

              {syncMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-white/60 p-2 bg-white/5 rounded-lg border border-white/10"
                >
                  {syncMessage}
                </motion.p>
              )}

              {/* Continue shopping */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/gallery')}
                className="w-full py-3 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Seguir comprando
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
