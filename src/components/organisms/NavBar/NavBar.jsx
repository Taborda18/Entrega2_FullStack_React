import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subscribeToAuthChanges, logoutUser } from '../../../services/authService';
import useCartStore from '../../../store/cartStore';
import logo1 from '../../../../img/logo1.png';

export default function NavBar() {
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setLoggedInUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logoutUser();
    setLoggedInUser(null);
  };

  const navLinks = [
    { to: '/gallery', label: 'Gallery', icon: '🛍️' },
    { to: '/cart', label: `Cart (${totalItems})`, icon: '🛒' },
    { to: '/profile', label: 'Profile', icon: '👤', auth: true },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sidebar-toggle lg:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={logo1} alt="Luxury Store" className="sidebar-brand-logo" />
            <span className="sidebar-brand-text">Luxury Store</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {navLinks.map((link) => {
            if (link.auth && !loggedInUser) return null;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`sidebar-link ${isActive(link.to) ? 'sidebar-link--active' : ''}`}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="sidebar-footer">
          {loggedInUser ? (
            <>
              <div className="sidebar-user">
                <div className="sidebar-avatar">
                  {(loggedInUser.displayName || loggedInUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="sidebar-username">
                  {loggedInUser.displayName || loggedInUser.name}
                </span>
              </div>
              <button onClick={handleLogout} className="sidebar-link sidebar-logout">
                <span className="sidebar-link-icon">🚪</span>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="sidebar-auth">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="sidebar-btn">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="sidebar-btn sidebar-btn--primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
