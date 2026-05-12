import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToAuthChanges } from '../../../services/authService';
import useCartStore from '../../../store/cartStore';
import logo1 from '../../../assets/logo1.png';

export default function NavBar() {
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      x: -320,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.06, duration: 0.3 },
    }),
  };

  const navItems = [
    { to: '/gallery', label: 'Colección', icon: '🛍️' },
    { to: '/cart', label: `Carrito (${totalItems})`, icon: '🛒' },
    ...(loggedInUser
      ? [{ to: '/profile', label: 'Mi Perfil', icon: '👤' }]
      : [
          { to: '/login', label: 'Iniciar Sesión', icon: '🔓' },
          { to: '/register', label: 'Registrarse', icon: '✨' },
        ]),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-white/20 backdrop-blur-xl p-6 z-40"
        style={{
          background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
          boxShadow: '-8px 0 32px rgba(168, 85, 247, 0.08)',
        }}
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <img
                src={logo1}
                alt="Luxury Store"
                className="relative h-full w-full rounded-xl object-cover ring-2 ring-white/30"
              />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-white via-pink-100 to-fuchsia-200 bg-clip-text text-transparent font-black text-lg tracking-tight">
                Luxury
              </span>
              <span className="text-xs text-white/60 font-semibold">Store</span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, i) => (
            <motion.div
              key={item.to}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                  isActive(item.to)
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive(item.to) && (
                  <motion.div
                    layoutId="navIndicator"
                    className="h-2 w-2 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-6 border-t border-white/10 space-y-3"
        >
          {loggedInUser ? (
            <>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Conectado como</p>
              <p className="text-white font-semibold truncate">{loggedInUser.email || loggedInUser.name}</p>
              <button
                onClick={() => {
                  localStorage.removeItem('loggedInUser');
                  window.location.reload();
                }}
                className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-semibold transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <p className="text-xs text-white/50 text-center">Inicia sesión para acceder a tu perfil</p>
          )}
        </motion.div>
      </motion.aside>

      {/* Mobile Sidebar Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:hidden fixed top-6 left-6 z-50 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </motion.button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-white/20 backdrop-blur-xl p-6 z-40"
              style={{
                background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                boxShadow: '-8px 0 32px rgba(168, 85, 247, 0.08)',
              }}
            >
              {/* Logo Section */}
              <div className="mb-8">
                <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-fuchsia-400 to-pink-500 blur-lg opacity-70" />
                    <img
                      src={logo1}
                      alt="Luxury Store"
                      className="relative h-full w-full rounded-lg object-cover ring-2 ring-white/30"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="bg-gradient-to-r from-white via-pink-100 to-fuchsia-200 bg-clip-text text-transparent font-black text-base">
                      Luxury
                    </span>
                    <span className="text-xs text-white/60 font-semibold">Store</span>
                  </div>
                </Link>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 space-y-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 group ${
                        isActive(item.to)
                          ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive(item.to) && (
                        <motion.div
                          layoutId="navIndicator"
                          className="h-2 w-2 rounded-full bg-white ml-auto"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* User Info Footer */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                {loggedInUser ? (
                  <>
                    <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Conectado como</p>
                    <p className="text-white font-semibold truncate text-sm">{loggedInUser.email || loggedInUser.name}</p>
                    <button
                      onClick={() => {
                        localStorage.removeItem('loggedInUser');
                        window.location.reload();
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold transition-all duration-300"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-white/50 text-center">Inicia sesión para acceder a tu perfil</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
