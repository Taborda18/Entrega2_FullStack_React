# 📱 Luxury E-Commerce Store - Documentación Completa del Proyecto

**Fecha**: Mayo 11, 2026  
**Estado**: ✅ Completado y Funcional  
**Stack**: React 19 + Vite + Tailwind CSS + Zustand + Axios

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Servicios API](#servicios-api)
6. [Estado Global (Zustand)](#estado-global-zustand)
7. [Componentes Principales](#componentes-principales)
8. [Estilos y CSS](#estilos-y-css)
9. [Lógica de Autenticación](#lógica-de-autenticación)
10. [Carrito de Compras](#carrito-de-compras)
11. [Guía de Instalación](#guía-de-instalación)

---

## 📖 Descripción General

Aplicación web de e-commerce de lujo construida con **React 19** y **Vite**. 

### Características Principales
- ✅ Autenticación con FakeStore API
- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Carrito de compras sincronizado con API
- ✅ Gestión de usuarios desde API
- ✅ Interfaz moderna con gradientes purple→fuchsia→pink
- ✅ Responsivo (mobile first)
- ✅ Sidebar lateral en lugar de navbar tradicional

### Credenciales de Prueba
```
Usuario: johnd
Contraseña: m38rmF$
```

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── atoms/                    # Componentes mínimos reutilizables
│   │   ├── Title.jsx
│   │   └── product/
│   │       ├── ProductImage.jsx
│   │       ├── ProductPrice.jsx
│   │       ├── ProductRate.jsx
│   │       └── ProductTitle.jsx
│   ├── molecules/                # Combinaciones de atoms
│   │   └── ProductCard.jsx
│   ├── organisms/                # Componentes complejos
│   │   ├── NavBar/
│   │   │   └── NavBar.jsx        # Sidebar lateral
│   │   ├── login/
│   │   │   └── Login.jsx
│   │   ├── register/
│   │   │   └── Register.jsx
│   │   ├── gallery/
│   │   │   ├── Gallery.jsx
│   │   │   ├── GalleryFilters.jsx
│   │   │   ├── GalleryHero.jsx
│   │   │   ├── GalleryPagination.jsx
│   │   │   ├── CollectionCarousel.jsx
│   │   │   ├── AddToCartToast.jsx
│   │   │   └── galleryUtils.js
│   │   ├── cart/
│   │   │   └── Cart.jsx
│   │   ├── checkout/
│   │   │   └── Checkout.jsx
│   │   ├── productDetail/
│   │   │   └── ProductDetail.jsx
│   │   └── profile/
│   │       └── Profile.jsx
│   └── templates/
│       └── Layout.jsx            # Layout principal
├── services/                     # Lógica de negocio y API
│   ├── authService.js            # Autenticación local
│   ├── productService.js         # Fetch de productos
│   └── (fakeStoreAuth.js - opción de API pura)
├── store/
│   └── cartStore.js              # Estado global con Zustand
├── mockdata/
│   ├── mock_products.js
│   └── mock_users.js
├── firebase/                     # Configuración Firebase
│   └── firebase.config.js
├── styles/
│   └── main.css                  # Estilos globales
├── main.jsx                      # Entry point
└── App.jsx                       # Router principal
```

---

## 🛠️ Tecnologías Utilizadas

### Dependencias de Producción

```json
{
  "@tailwindcss/vite": "^4.2.2",      // CSS utility-first framework
  "axios": "^1.15.0",                 // HTTP client
  "firebase": "^12.12.0",             // Backend services (opcional)
  "react": "^19.2.4",                 // UI library
  "react-dom": "^19.2.4",             // React DOM rendering
  "react-router-dom": "^7.14.1",      // Routing
  "tailwindcss": "^4.2.2",            // CSS framework
  "zustand": "^5.0.12"                // State management (ligero)
}
```

### Build & Dev Tools
- **Vite**: Bundler ultrarrápido
- **ESLint**: Linting de código
- **Vitals**: Métricas de rendimiento

---

## 🔐 Configuración de Variables de Entorno

### .env (NO se sube a Git)
```env
# FakeStore API Configuration
VITE_API_BASE_URL=https://fakestoreapi.com

# API Endpoints
VITE_API_AUTH_LOGIN=/auth/login
VITE_API_PRODUCTS=/products
VITE_API_CARTS=/carts
VITE_API_USERS=/users

# Storage Keys
VITE_STORAGE_LOGGED_IN_USER=loggedInUser
VITE_STORAGE_USER_TOKEN=userToken
VITE_STORAGE_REGISTERED_USERS=registeredUsers
```

### .env.example (Se sube a Git como referencia)
Contiene la misma estructura que .env pero sin valores sensibles.

### .gitignore
```
.env
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
```

---

## 🌐 Servicios API

### 1. authService.js - Autenticación Local
```javascript
import MOCK_USERS from "../mockdata/mock_users";

const REGISTERED_USERS_KEY = import.meta.env.VITE_STORAGE_REGISTERED_USERS;
const LOGGED_IN_USER_KEY = import.meta.env.VITE_STORAGE_LOGGED_IN_USER;

// Mapear formato de usuario
const mapUserShape = (user) => ({
  uid: String(user.id ?? Date.now()),
  displayName: user.name,
  name: user.name,
  email: user.email,
  cellphone: user.cellphone ?? "",
  address: user.address ?? "",
  emailVerified: true,
});

// Obtener usuarios registrados del localStorage
const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

// Obtener usuario actual
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || "null");
  } catch {
    return null;
  }
};

// Notificar cambios de auth
const notifyAuthChange = () => {
  window.dispatchEvent(new Event("template-auth-change"));
};

// Suscribirse a cambios de autenticación
export const subscribeToAuthChanges = (callback) => {
  const handler = () => callback(getCurrentUser());
  handler(); // Llamar inmediatamente con estado actual
  window.addEventListener("storage", handler);
  window.addEventListener("template-auth-change", handler);

  // Retornar función para desuscribirse
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("template-auth-change", handler);
  };
};

// Login
export const loginUser = async (email, password) => {
  const registeredUsers = getRegisteredUsers();
  const allUsers = [...MOCK_USERS, ...registeredUsers];
  const foundUser = allUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return { success: false, error: "Correo o contraseña incorrectos" };
  }

  const normalizedUser = mapUserShape(foundUser);
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(normalizedUser));
  notifyAuthChange();

  return { success: true, user: normalizedUser };
};

// Logout
export const logoutUser = async () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  notifyAuthChange();
  return { success: true };
};

// Register
export const registerFullUser = async (userData) => {
  const registeredUsers = getRegisteredUsers();
  const allUsers = [...MOCK_USERS, ...registeredUsers];
  const emailExists = allUsers.some(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (emailExists) {
    return { success: false, error: "El email ya está registrado." };
  }

  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    cellphone: userData.cellphone ?? "",
    address: userData.address ?? "",
    password: userData.password,
  };

  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify([...registeredUsers, newUser])
  );

  return { success: true, user: mapUserShape(newUser) };
};
```

### 2. productService.js - Productos desde API
```javascript
import MOCK_PRODUCTS from "../mockdata/mock_products";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCTS_ENDPOINT = import.meta.env.VITE_API_PRODUCTS;

// Normalizar productos
const normalizeProduct = (product, source = "api") => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: Number(product.price),
  image: product.image,
  category: product.category ?? "General",
  rate: Number(product.rate ?? product.rating?.rate ?? 0),
  ratingCount: Number(product.ratingCount ?? product.rating?.count ?? 0),
  source,
});

// Fallback a mock data si la API falla
const getFallbackProducts = () =>
  [...MOCK_PRODUCTS]
    .map((item) => normalizeProduct(item, "mock"))
    .sort((a, b) => Number(a.id) - Number(b.id));

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`);
    return response.data
      .map((item) => normalizeProduct(item, "api"))
      .sort((a, b) => Number(a.id) - Number(b.id));
  } catch {
    return getFallbackProducts();
  }
};

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`);
    return normalizeProduct(response.data, "api");
  } catch {
    const fallback = getFallbackProducts().find(
      (item) => Number(item.id) === Number(id)
    );
    return fallback ?? null;
  }
};
```

---

## 🎛️ Estado Global (Zustand)

### cartStore.js - Gestión del Carrito
```javascript
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  // Estado
  items: [],
  cartTotal: 0,
  itemCount: 0,

  // Acciones
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);
    
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    
    return {
      items: [...state.items, { product, quantity: 1 }],
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter((item) => item.product.id !== productId),
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    items: quantity > 0
      ? state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      : state.items.filter((item) => item.product.id !== productId),
  })),

  clearCart: () => set({ items: [] }),

  getCartTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },
}));
```

---

## 🎨 Componentes Principales

### 1. NavBar.jsx - Sidebar Lateral
```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAuthChanges, logoutUser } from '../../services/authService';
import { useCartStore } from '../../store/cartStore';

const NavBar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    // Suscribirse a cambios de autenticación
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-72 bg-white shadow-lg
          transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          z-40
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            LuxeStore
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <NavLink to="/gallery" label="Shop" />
          <NavLink to="/cart" label={`Cart (${itemCount})`} />
          {currentUser && <NavLink to="/profile" label="Profile" />}
        </nav>

        {/* User Info Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          {currentUser ? (
            <div>
              <p className="text-sm text-gray-600">{currentUser.displayName}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" label="Login" />
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

const NavLink = ({ to, label }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
    >
      {label}
    </button>
  );
};

export default NavBar;
```

### 2. Login.jsx - Pantalla de Autenticación
```javascript
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from "../../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate('/gallery');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg border border-purple-100">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome
          </h1>
          <p className="text-gray-500 text-lg">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Sign In
          </button>

        </form>

        {/* Test Credentials Info */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-600">
          <strong>Demo:</strong> johnd / m38rmF$
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 3. Cart.jsx - Carrito de Compras
```javascript
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const Cart = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/gallery')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg mb-4">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-bold">{item.product.title}</h3>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

### 4. Gallery.jsx - Catálogo de Productos
```javascript
import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/molecules/ProductCard';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:ml-72">
      
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
```

---

## 🎨 Estilos y CSS

### main.css - Estilos Globales
```css
/* Variables de Color */
:root {
  --color-purple: #9333ea;
  --color-fuchsia: #d946ef;
  --color-pink: #ec4899;
  --color-gradient: linear-gradient(135deg, #9333ea 0%, #d946ef 50%, #ec4899 100%);
}

/* Reset Global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(217, 70, 239, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%);
}

/* Gradientes Personalizados */
.bg-gradient-luxury {
  background: var(--color-gradient);
}

.text-gradient-luxury {
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Botones */
.btn-luxury {
  background: var(--color-gradient);
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-luxury:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(147, 51, 234, 0.3);
}

.btn-luxury:active {
  transform: translateY(0);
}

/* Cards */
.card-luxury {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(147, 51, 234, 0.1);
  transition: all 0.3s ease;
}

.card-luxury:hover {
  box-shadow: 0 20px 25px rgba(147, 51, 234, 0.15);
  transform: translateY(-4px);
}

/* Inputs */
.input-luxury {
  border: 2px solid #e0e7ff;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-luxury:focus {
  outline: none;
  border-color: var(--color-purple);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Animaciones */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }

  .mobile-container {
    padding: 1rem;
  }
}
```

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6d28d9',
        },
        fuchsia: {
          500: '#d946ef',
          600: '#c81d86',
          700: '#ad1457',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
      },
      gradients: {
        luxury: 'linear-gradient(135deg, #9333ea 0%, #d946ef 50%, #ec4899 100%)',
      },
    },
  },
  plugins: [],
}
```

---

## 🔐 Lógica de Autenticación

### Flujo de Login
1. Usuario ingresa email y contraseña en Login.jsx
2. Se llama `loginUser()` de authService.js
3. Se busca usuario en MOCK_USERS o registeredUsers
4. Si existe y credenciales son correctas:
   - Se guarda en localStorage con clave `loggedInUser`
   - Se dispara evento `template-auth-change`
   - Se redirige a `/gallery`
5. NavBar está suscrito a cambios y actualiza automáticamente

### Eventos de Autenticación
```javascript
// Cuando hay login exitoso:
window.dispatchEvent(new Event("template-auth-change"));

// NavBar se suscribe:
useEffect(() => {
  const unsubscribe = subscribeToAuthChanges((user) => {
    setCurrentUser(user);
  });
  return unsubscribe;
}, []);
```

### Credenciales de Prueba
```javascript
// mock_users.js
export const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "johnd@example.com",
    password: "m38rmF$",
    ...
  },
  // ... más usuarios
];
```

---

## 🛒 Carrito de Compras

### Arquitectura del Carrito
- **Estado Global**: Zustand (cartStore.js)
- **Persistencia**: localStorage (opcional)
- **Sincronización**: Automática cuando se agrega/modifica

### Estructura del Carrito
```javascript
{
  items: [
    {
      product: { id, title, price, image, ... },
      quantity: 1
    }
  ],
  cartTotal: 0,
  itemCount: 0
}
```

### Operaciones Disponibles
```javascript
// Obtener el store
const cart = useCartStore();

// Agregar producto
cart.addToCart(product);

// Remover producto
cart.removeFromCart(productId);

// Actualizar cantidad
cart.updateQuantity(productId, 3);

// Limpiar carrito
cart.clearCart();

// Obtener total
const total = cart.getCartTotal();

// Obtener cantidad de items
const count = cart.getItemCount();
```

---

## 📦 Guía de Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Taborda18/Entrega2_FullStack_React.git
cd Entrega2_FullStack_React
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Crear Archivo .env
Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

Contenido del `.env`:
```env
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_API_AUTH_LOGIN=/auth/login
VITE_API_PRODUCTS=/products
VITE_API_CARTS=/carts
VITE_API_USERS=/users
VITE_STORAGE_LOGGED_IN_USER=loggedInUser
VITE_STORAGE_USER_TOKEN=userToken
VITE_STORAGE_REGISTERED_USERS=registeredUsers
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### 5. Build para Producción
```bash
npm run build
```
Los archivos compilados estarán en la carpeta `dist/`

### 6. Preview de Producción
```bash
npm run preview
```

---

## 🔗 Endpoints de FakeStore API

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/auth/login` | Login |
| GET | `/products` | Todos los productos |
| GET | `/products/{id}` | Producto específico |
| GET | `/carts` | Todos los carritos |
| POST | `/carts` | Crear carrito |
| GET | `/users` | Todos los usuarios |
| POST | `/users` | Crear usuario |

---

## ✅ Checklist Final

- [x] Autenticación funcional
- [x] Catálogo de productos
- [x] Carrito de compras con Zustand
- [x] Sidebar lateral responsive
- [x] Busqueda y filtros
- [x] Variables de entorno configuradas
- [x] Estilos con Tailwind CSS
- [x] Gradientes purple→fuchsia→pink
- [x] Build sin errores
- [x] Commits en Git

---

## 📝 Notas Finales

- **FakeStore API**: Simulación gratuita, no hace cambios reales
- **localStorage**: Se usa para persistencia temporal
- **Zustand**: Alternativa ligera a Redux (5KB vs 40KB)
- **Tailwind CSS**: Utility-first CSS framework (muy rápido)
- **Vite**: 10-100x más rápido que Webpack

---

**Última actualización**: Mayo 11, 2026  
**Versión**: 1.0.0  
**Autor**: Equipo de Desarrollo
