# 🔧 IMPLEMENTACIÓN TÉCNICA - Detalles Avanzados

**Documento Complementario** - Para una migración exitosa del proyecto

---

## 📋 Tabla de Contenidos

1. [Estructura de Carpetas Detallada](#estructura-de-carpetas-detallada)
2. [Importancia del Cada Archivo](#importancia-del-cada-archivo)
3. [Flujos Clave del Sistema](#flujos-clave-del-sistema)
4. [Integración de APIs](#integración-de-apis)
5. [Patrones de Diseño Utilizados](#patrones-de-diseño-utilizados)
6. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
7. [Performance y Optimizaciones](#performance-y-optimizaciones)

---

## 📁 Estructura de Carpetas Detallada

```
src/
├── components/                          # Componentes React estructurados por atómicidad
│   ├── atoms/                          # Componentes fundamentales (sin dependencias complejas)
│   │   ├── Title.jsx
│   │   │   ├── Props: text, size, variant
│   │   │   └── Uso: Títulos reutilizables en toda la app
│   │   │
│   │   └── product/
│   │       ├── ProductImage.jsx        # Imagen del producto
│   │       ├── ProductPrice.jsx        # Precio formateado
│   │       ├── ProductRate.jsx         # Estrellas de rating
│   │       └── ProductTitle.jsx        # Título del producto
│   │
│   ├── molecules/                      # Combinaciones de atoms (componentes pequeños)
│   │   └── ProductCard.jsx
│   │       ├── Combina: ProductImage, ProductPrice, ProductTitle, ProductRate
│   │       ├── Props: product, onAddToCart
│   │       └── Uso: Tarjetas individuales en la galería
│   │
│   ├── organisms/                      # Componentes grandes y complejos
│   │   ├── NavBar/
│   │   │   └── NavBar.jsx
│   │   │       ├── Renderiza: Logo, Links de navegación, Info del usuario
│   │   │       ├── Estado: currentUser, isMobileMenuOpen
│   │   │       ├── Suscriptores: subscribeToAuthChanges
│   │   │       └── Funciones: handleLogout
│   │   │
│   │   ├── login/
│   │   │   └── Login.jsx
│   │   │       ├── Renderiza: Formulario de login
│   │   │       ├── Estado: formData, error
│   │   │       ├── Submit: loginUser(email, password)
│   │   │       └── Redirección: /gallery (si es exitoso)
│   │   │
│   │   ├── register/
│   │   │   └── Register.jsx
│   │   │       ├── Renderiza: Formulario de registro
│   │   │       ├── Validaciones: Email único, contraseña fuerte
│   │   │       └── Submit: registerFullUser(userData)
│   │   │
│   │   ├── gallery/
│   │   │   ├── Gallery.jsx             # Página principal de productos
│   │   │   ├── GalleryFilters.jsx      # Filtros por categoría
│   │   │   ├── GalleryHero.jsx         # Banner principal
│   │   │   ├── GalleryPagination.jsx   # Paginación
│   │   │   ├── CollectionCarousel.jsx  # Carrusel de colecciones
│   │   │   ├── AddToCartToast.jsx      # Notificación al agregar
│   │   │   └── galleryUtils.js         # Funciones auxiliares
│   │   │
│   │   ├── cart/
│   │   │   └── Cart.jsx
│   │   │       ├── Renderiza: Lista de items, resumen de orden
│   │   │       ├── Estado: items, total (desde Zustand)
│   │   │       ├── Funciones: updateQuantity, removeFromCart
│   │   │       └── Botón: "Proceed to Checkout"
│   │   │
│   │   ├── checkout/
│   │   │   └── Checkout.jsx
│   │   │       ├── Renderiza: Formulario de envío y pago
│   │   │       ├── Validaciones: Datos de envío completos
│   │   │       └── Simulación: Procesa orden (sin real payment)
│   │   │
│   │   ├── productDetail/
│   │   │   └── ProductDetail.jsx
│   │   │       ├── Obtiene: getProductById(id)
│   │   │       ├── Renderiza: Imagen grande, descripción completa
│   │   │       ├── Botón: "Add to Cart" → addToCart(product)
│   │   │       └── Info: Detalles técnicos del producto
│   │   │
│   │   └── profile/
│   │       └── Profile.jsx
│   │           ├── Obtiene: currentUser del localStorage
│   │           ├── Renderiza: Información del usuario
│   │           └── Acciones: Editar perfil, ver órdenes
│   │
│   └── templates/
│       └── Layout.jsx
│           ├── Renderiza: NavBar + contenido
│           ├── Routing: Maneja todas las rutas
│           └── Estructura: Layout principal de la app
│
├── services/                           # Lógica de negocio y comunicación con APIs
│   ├── authService.js
│   │   ├── Funciones: loginUser, logoutUser, registerFullUser
│   │   ├── Eventos: template-auth-change
│   │   ├── Storage: loggedInUser, registeredUsers
│   │   └── Patrón: Observer (subscribeToAuthChanges)
│   │
│   ├── productService.js
│   │   ├── Funciones: getProducts(), getProductById(id)
│   │   ├── API: https://fakestoreapi.com/products
│   │   ├── Normalización: Formato consistente de datos
│   │   └── Fallback: Retorna mock_products si API falla
│   │
│   ├── cartService.js (si se implementa API)
│   │   ├── Funciones: createCart, updateCart, deleteCart
│   │   ├── API: https://fakestoreapi.com/carts
│   │   └── Sincronización: Envía datos a servidor
│   │
│   ├── userService.js (si se implementa API)
│   │   ├── Funciones: getAllUsers, getUserById, updateUser
│   │   ├── API: https://fakestoreapi.com/users
│   │   └── Normalización: Formato consistente de usuarios
│   │
│   └── fakeStoreAuth.js (alternativa de autenticación)
│       ├── Funciones: loginWithFakeStore
│       ├── API: https://fakestoreapi.com/auth/login
│       ├── Evento: fakestore-auth-change
│       └── Token: Guardado en USER_TOKEN_KEY
│
├── store/                             # Estado global con Zustand
│   └── cartStore.js
│       ├── Estado:
│       │   ├── items: Array<{product, quantity}>
│       │   ├── cartTotal: number
│       │   └── itemCount: number
│       │
│       ├── Actions:
│       │   ├── addToCart(product)
│       │   ├── removeFromCart(productId)
│       │   ├── updateQuantity(productId, quantity)
│       │   ├── clearCart()
│       │   ├── getCartTotal()
│       │   └── getItemCount()
│       │
│       └── Hook: useCartStore((state) => state.items)
│
├── mockdata/                          # Datos simulados para desarrollo/fallback
│   ├── mock_products.js
│   │   └── Array de ~20 productos con: id, title, price, image, etc.
│   │
│   └── mock_users.js
│       └── Array de usuarios de demo: johnd, m38rmF$, etc.
│
├── firebase/                          # Configuración Firebase (opcional)
│   ├── firebase.config.js
│   ├── auth.js
│   └── products.js
│
├── styles/
│   └── main.css                       # Estilos globales + animaciones
│
├── main.jsx                           # Entry point de React
├── App.jsx                            # Rutas principales
└── index.html                         # HTML base
```

---

## 🎯 Importancia de Cada Archivo

### authService.js (CRÍTICO)
**Por qué es importante:**
- Punto central de autenticación
- Todos los componentes que necesitan usuario lo usan
- Maneja eventos de cambio de estado
- Sincroniza localStorage con UI

**Cambios importantes realizados:**
```javascript
// ✅ NUEVO: Escucha AMBOS eventos
export const subscribeToAuthChanges = (callback) => {
  const handler = () => callback(getCurrentUser());
  handler();
  window.addEventListener("storage", handler);
  window.addEventListener("template-auth-change", handler);
  // ✅ AGREGADO: También escucha fakestore-auth-change
  window.addEventListener("fakestore-auth-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("template-auth-change", handler);
    window.removeEventListener("fakestore-auth-change", handler);
  };
};
```

### cartStore.js (CRÍTICO)
**Por qué es importante:**
- Zustand es más eficiente que Redux
- Pequeño pero poderoso
- Todos los componentes que modifican carrito lo usan

**Estructura optimizada:**
```javascript
const useCartStore = create((set, get) => ({
  // Estado reactivo
  items: [],
  
  // Acciones que actualizan estado
  addToCart: (product) => set((state) => ({...})),
  
  // Selectores para obtener datos derivados
  getCartTotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}));
```

### productService.js (IMPORTANTE)
**Por qué es importante:**
- Centraliza todas las llamadas a API
- Implementa fallback a mock data
- Normaliza formatos de datos

**Característica clave: Fallback automático**
```javascript
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`);
    return response.data.map((item) => normalizeProduct(item, "api"));
  } catch {
    // ✅ Si la API falla, retorna mock data
    return getFallbackProducts();
  }
};
```

### NavBar.jsx (IMPORTANTE)
**Por qué es importante:**
- Suscriptor principal de cambios de auth
- Muestra estado actual del usuario
- Controla navegación principal

**Patrón clave: useEffect con cleanup**
```javascript
useEffect(() => {
  // ✅ Se suscribe a cambios de auth
  const unsubscribe = subscribeToAuthChanges((user) => {
    setCurrentUser(user);
  });

  // ✅ Limpieza: se desuscribe al desmontar
  return unsubscribe;
}, []);
```

### .env & .env.example (CRÍTICO PARA SEGURIDAD)
**Por qué es importante:**
- NO expone URLs en código
- Fácil cambiar entre ambientes
- .gitignore previene que se suba a Git

```env
# ✅ VARIABLES DE ENTORNO - Accesibles en runtime
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_API_AUTH_LOGIN=/auth/login
VITE_STORAGE_LOGGED_IN_USER=loggedInUser
```

---

## 🔄 Flujos Clave del Sistema

### Flujo 1: Login Exitoso
```
User escribe email/password en Login.jsx
         ↓
loginUser(email, password) en authService.js
         ↓
Busca en MOCK_USERS o registeredUsers
         ↓
Usuario encontrado + contraseña correcta
         ↓
localStorage.setItem('loggedInUser', JSON.stringify(user))
         ↓
window.dispatchEvent(new Event('template-auth-change'))
         ↓
NavBar.useEffect() escucha evento
         ↓
subscribeToAuthChanges(callback) se ejecuta
         ↓
setCurrentUser(user) → NavBar re-renderiza
         ↓
navigate('/gallery')
```

### Flujo 2: Agregar Producto al Carrito
```
User hace click en ProductCard
         ↓
onClick={() => cart.addToCart(product)}
         ↓
useCartStore.addToCart(product) en cartStore.js
         ↓
set((state) => ({
  items: [...state.items, {product, quantity: 1}]
}))
         ↓
Zustand notifica a todos los suscriptores
         ↓
Componentes que usan useCartStore re-renderizan
         ↓
NavBar muestra número de items actualizado
         ↓
Toast muestra "Agregado al carrito"
```

### Flujo 3: Sincronización de Productos
```
Gallery.jsx monta
         ↓
useEffect(() => { fetchProducts() }, [])
         ↓
productService.getProducts()
         ↓
Intenta GET a https://fakestoreapi.com/products
         ↓
¿Éxito?
  SÍ → Retorna datos de API (normalizado)
  NO → Retorna mock_products como fallback
         ↓
setProducts(data)
         ↓
Grid muestra productos
```

---

## 🔌 Integración de APIs

### FakeStore API Base
```
Base URL: https://fakestoreapi.com
```

### Endpoints Utilizados

**1. Autenticación**
```
POST /auth/login
Request: { username, password }
Response: { token: "..." }
```

**2. Productos**
```
GET /products
Response: [{id, title, price, description, category, image, rating: {rate, count}}]

GET /products/{id}
Response: {id, title, price, description, category, image, rating: {rate, count}}
```

**3. Usuarios**
```
GET /users
Response: [{id, username, email, name, phone, address, ...}]

GET /users/{id}
Response: {id, username, email, name, phone, address, ...}
```

**4. Carritos**
```
GET /carts
GET /carts/{id}
POST /carts
Body: {userId, products: [{productId, quantity}]}
PUT /carts/{id}
DELETE /carts/{id}
```

### Normalización de Datos

**Problema**: Las APIs retornan datos en diferentes formatos

**Solución**: Función `normalizeProduct()` en productService.js
```javascript
const normalizeProduct = (product, source = "api") => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: Number(product.price),
  image: product.image,
  category: product.category ?? "General",
  // Maneja ambos formatos de rating
  rate: Number(product.rate ?? product.rating?.rate ?? 0),
  ratingCount: Number(product.ratingCount ?? product.rating?.count ?? 0),
  source,
});
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. Observer Pattern (Autenticación)
```javascript
// authService.js
export const subscribeToAuthChanges = (callback) => {
  // Se suscribe
  window.addEventListener("template-auth-change", callback);
  // Retorna función para desuscribirse
  return () => {
    window.removeEventListener("template-auth-change", callback);
  };
};

// NavBar.jsx
useEffect(() => {
  // Se suscribe al montar
  const unsubscribe = subscribeToAuthChanges(setCurrentUser);
  // Se desuscribe al desmontar
  return unsubscribe;
}, []);
```

### 2. Singleton Pattern (Zustand Store)
```javascript
// Existe una sola instancia del store
const useCartStore = create((set, get) => ({...}));

// Se accede desde cualquier componente
const items = useCartStore((state) => state.items);
```

### 3. Factory Pattern (Normalización)
```javascript
// normalizeProduct es una factory que crea objetos consistentes
const product = normalizeProduct(apiData, "api");
```

### 4. Fallback Pattern (Resilencia)
```javascript
export const getProducts = async () => {
  try {
    return await axios.get(...);
  } catch {
    return getFallbackProducts(); // Fallback seguro
  }
};
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: "NavBar no se actualiza después de login"
**Problema**: NavBar subscribes to `template-auth-change` pero fakeStoreAuth dispatch `fakestore-auth-change`

**Solución**:
```javascript
// ✅ authService.js - escuchar ambos eventos
export const subscribeToAuthChanges = (callback) => {
  const handler = () => callback(getCurrentUser());
  handler();
  window.addEventListener("template-auth-change", handler);
  window.addEventListener("fakestore-auth-change", handler); // ✅ AGREGADO
  return () => {
    window.removeEventListener("template-auth-change", handler);
    window.removeEventListener("fakestore-auth-change", handler);
  };
};
```

### Error 2: "Carrito no persiste al recargar"
**Problema**: Estado de Zustand se pierde al recargar la página

**Solución**: Implementar persistencia
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({...}),
    { name: 'cart-storage' } // localStorage key
  )
);
```

### Error 3: "Variables de entorno undefined en cliente"
**Problema**: `process.env.VAR` no funciona en Vite

**Solución**: Usar `import.meta.env.VITE_VAR`
```javascript
// ❌ MALO (no funciona en Vite)
const url = process.env.REACT_APP_API_URL;

// ✅ BUENO (correcto para Vite)
const url = import.meta.env.VITE_API_BASE_URL;
```

### Error 4: "Productos no se cargan de API"
**Problema**: CORS o conexión fallida

**Solucion**: El código ya tiene fallback automático
```javascript
export const getProducts = async () => {
  try {
    const response = await axios.get(...);
    return response.data; // Si funciona, retorna datos reales
  } catch {
    return getFallbackProducts(); // Si falla, retorna mock data
  }
};
```

---

## ⚡ Performance y Optimizaciones

### 1. Code Splitting (Recomendado)
```javascript
// App.jsx - Lazy loading de rutas
import { lazy, Suspense } from 'react';

const Gallery = lazy(() => import('./pages/Gallery'));
const Cart = lazy(() => import('./pages/Cart'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Memoización de Componentes
```javascript
// ProductCard.jsx - Evitar re-renders innecesarios
import { memo } from 'react';

const ProductCard = memo(({ product, onAddToCart }) => {
  return (...);
}, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});

export default ProductCard;
```

### 3. Selector Optimization en Zustand
```javascript
// ✅ BUENO - Solo re-renderiza si `items` cambia
const items = useCartStore((state) => state.items);

// ❌ MALO - Re-renderiza en CUALQUIER cambio del store
const store = useCartStore();
const items = store.items;
```

### 4. useCallback para Funciones
```javascript
// NavBar.jsx - Evitar funciones nuevas en cada render
const handleLogout = useCallback(async () => {
  await logoutUser();
  navigate('/login');
}, [navigate]);
```

### 5. Batch Updates en React 18
```javascript
// Zustand automáticamente batch updates con React 18
set((state) => ({
  items: [...state.items, newItem], // Múltiples cambios
  itemCount: state.itemCount + 1,    // Se applican juntos
}));
```

---

## 📊 Tamaño de Build Actual

```
dist/assets/index.js        600.98 kB (184.82 kB gzipped)
dist/assets/index.css        62.72 kB (10.45 kB gzipped)
dist/assets/images        1,726.64 kB
────────────────────────────────────────
Total                     2,390.34 kB
```

### Oportunidades de Optimización Futura
1. **Lazy load images** → Code image plugin
2. **Dynamic imports for heavy libraries** → Chunk splitting
3. **CSS purging** → Remover CSS no usado
4. **Image optimization** → WebP format
5. **Tree shaking** → Remover código muerto

---

## 🚀 Checklist para Nueva Instancia

```
[ ] Clonar repositorio
[ ] Instalar npm dependencies
[ ] Crear .env desde .env.example
[ ] npm run dev
[ ] Probar login con johnd / m38rmF$
[ ] Verificar carrito funciona
[ ] Verificar que NavBar se actualiza al login
[ ] Probar búsqueda de productos
[ ] Probar agregar al carrito
[ ] Probar checkout
[ ] npm run build - verificar tamaño
[ ] Documentar cambios si los hay
[ ] Hacer push a GitHub
```

---

**Última actualización**: Mayo 11, 2026  
**Versión**: 1.0.0 - Documentación Técnica Completa
