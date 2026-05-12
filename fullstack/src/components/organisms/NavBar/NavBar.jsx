import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToAuthChanges } from '../../../services/authService';
import useCartStore from '../../../store/cartStore';
import logo1 from '../../../assets/logo1.png';

export default function NavBar() {
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 },
    }),
  };

  const renderLink = (to, label, index) => (
    <motion.li
      key={to}
      custom={index}
      variants={navLinkVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={to}
        className={`relative text-sm sm:text-base font-semibold transition-all duration-300 pb-2 border-b-2 ${
          isActive(to)
            ? 'text-white border-fuchsia-400'
            : 'text-white/80 border-transparent hover:text-white hover:border-pink-400/50'
        }`}
      >
        {label}
      </Link>
    </motion.li>
  );

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        boxShadow: '0 8px 32px rgba(168, 85, 247, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-300"
            >
              <div className="relative h-9 w-9 sm:h-10 sm:w-10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <img
                  src={logo1}
                  alt="Luxury Store"
                  className="relative h-full w-full rounded-xl object-cover ring-2 ring-white/30 shadow-lg"
                />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-white via-pink-100 to-fuchsia-200 bg-clip-text text-transparent font-black text-lg sm:text-xl tracking-tight">
                Luxury Store
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {renderLink('/gallery', 'Colección', 0)}
            {renderLink('/cart', `Carrito (${totalItems})`, 1)}
            {loggedInUser ? (
              renderLink('/profile', 'Mi Perfil', 2)
            ) : (
              <>
                {renderLink('/login', 'Iniciar Sesión', 2)}
                {renderLink('/register', 'Registrarse', 3)}
              </>
            )}
          </ul>

          {/* Auth Status Indicator (Mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:hidden flex items-center gap-2"
          >
            <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
