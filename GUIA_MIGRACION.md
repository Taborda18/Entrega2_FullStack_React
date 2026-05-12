# 🚀 GUÍA DE MIGRACIÓN - Pasar el Proyecto a Otro Chat/Equipo

**Documento para clonar este proyecto en un nuevo ambiente**

---

## 📋 Sumario Ejecutivo

Este proyecto es una **tienda e-commerce de lujo** construida en:
- **Frontend**: React 19 + Vite
- **UI**: Tailwind CSS + Gradientes Purple→Fuchsia→Pink
- **State**: Zustand (5KB)
- **API**: FakeStore API (https://fakestoreapi.com)
- **Build**: ~600KB JS, 2.3MB total

**Tiempo de setup**: 5-10 minutos  
**Credenciales demo**: johnd / m38rmF$

---

## 🔑 Lo Más Importante (Si Solo Tienes 5 Minutos)

### Variables de Entorno
```bash
# .env (NO se sube a Git)
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_API_AUTH_LOGIN=/auth/login
VITE_API_PRODUCTS=/products
VITE_API_CARTS=/carts
VITE_API_USERS=/users
VITE_STORAGE_LOGGED_IN_USER=loggedInUser
VITE_STORAGE_USER_TOKEN=userToken
VITE_STORAGE_REGISTERED_USERS=registeredUsers
```

### Archivos Críticos
- `src/services/authService.js` - Autenticación
- `src/store/cartStore.js` - Carrito (Zustand)
- `src/components/organisms/NavBar/NavBar.jsx` - Sidebar
- `src/services/productService.js` - Fetch de productos

### Evento Crítico Que Se Arregló
```javascript
// ✅ authService.js escucha AMBOS eventos
window.addEventListener("template-auth-change", handler);
window.addEventListener("fakestore-auth-change", handler);
// Permite que NavBar se actualice inmediatamente después de login
```

---

## 📦 Paso a Paso: Instalación Completa

### 1. Clonar Repositorio
```bash
git clone https://github.com/Taborda18/Entrega2_FullStack_React.git
cd Entrega2_FullStack_React
```

### 2. Instalar Dependencias
```bash
npm install
```

Esto instalará:
- react@19.2.4
- react-dom@19.2.4
- react-router-dom@7.14.1
- zustand@5.0.12
- axios@1.15.0
- tailwindcss@4.2.2
- vite@8.0.4

### 3. Crear Archivo .env
```bash
# Copiar .env.example a .env
cp .env.example .env

# Luego editar .env con los valores reales
```

**Contenido de .env:**
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

La app estará en: http://localhost:5173

### 5. Testear Flujo Básico
1. Ir a http://localhost:5173/login
2. Usar credenciales: `johnd` / `m38rmF$`
3. Deberías ver username en sidebar inmediatamente
4. Ir a `/gallery`
5. Agregar producto al carrito
6. Ver contador actualizar en NavBar

### 6. Build para Producción
```bash
npm run build
# Archivos en dist/
npm run preview
```

---

## 🗂️ Archivos Principales Explicados

### authService.js
```javascript
// Maneja LOGIN, LOGOUT, REGISTRO
// Usa localStorage para persistencia
// Dispara eventos para notificar cambios

Key functions:
- loginUser(email, password) → {success, user, error}
- logoutUser() → {success}
- registerFullUser(userData) → {success, user, error}
- subscribeToAuthChanges(callback) → unsubscribe function

Key storage keys:
- loggedInUser: Usuario actual
- registeredUsers: Array de usuarios registrados
```

### productService.js
```javascript
// Fetch de productos desde API
// Incluye fallback a mock data si API falla

Key functions:
- getProducts() → Array<Product>
- getProductById(id) → Product

API endpoint:
- GET https://fakestoreapi.com/products
- GET https://fakestoreapi.com/products/{id}

Normaliza datos para formato consistente
```

### cartStore.js (Zustand)
```javascript
// Estado global del carrito
// Acceso desde cualquier componente con: useCartStore()

State:
- items: Array<{product, quantity}>
- cartTotal: number
- itemCount: number

Actions:
- addToCart(product)
- removeFromCart(productId)
- updateQuantity(productId, quantity)
- clearCart()
- getCartTotal()
- getItemCount()

Ejemplo de uso:
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addToCart);
addItem(product);
```

### NavBar.jsx
```javascript
// Sidebar lateral (responsive)
// Muestra usuario actual
// Botón de logout
// Contador de carrito

Key states:
- currentUser: Usuario logueado o null
- isMobileMenuOpen: Sidebar visible en mobile

Key effects:
- Suscribe a subscribeToAuthChanges(setCurrentUser)
- Actualiza cuando hay cambios de auth

Responsive:
- Oculto en mobile (toggle button)
- Fixed sidebar en desktop (lg:)
```

### Login.jsx
```javascript
// Formulario de login
// Envía a /gallery si login exitoso

Form fields:
- email (required)
- password (required)

On submit:
1. loginUser(email, password)
2. Si success → navigate('/gallery')
3. Si error → mostrar error

Demo credentials:
- Email: johnd@example.com
- Password: m38rmF$
```

---

## 🔄 Flujos Principales

### Login Flow
```
1. User ingresa email/password en Login.jsx
2. Click "Sign In" → handleSubmit
3. loginUser(email, password) busca usuario
4. Si found:
   - localStorage.setItem('loggedInUser', user)
   - window.dispatchEvent('template-auth-change')
   - navigate('/gallery')
5. NavBar.useEffect() escucha evento
6. subscribeToAuthChanges() actualiza currentUser
7. NavBar re-renderiza con username
```

### Add to Cart Flow
```
1. User en ProductCard hace click "Add to Cart"
2. onClick → cart.addToCart(product)
3. Zustand actualiza items state
4. Todos los suscriptores re-renderizan
5. NavBar muestra itemCount actualizado
6. Toast muestra "Agregado al carrito"
7. Gallery sigue funcional
```

### Gallery Load Flow
```
1. Gallery.jsx monta
2. useEffect → getProducts()
3. productService intenta:
   - GET https://fakestoreapi.com/products
4. Si success → retorna datos normalizados
5. Si error → retorna mock data como fallback
6. setProducts(data)
7. Grid renderiza 20 productos
8. Usuarios pueden:
   - Ver detalles (click en card)
   - Buscar (search bar)
   - Agregar al carrito
```

---

## 🎨 Diseño Visual

### Colores Principales
```
Purple:  #9333ea (rgb(147, 51, 234))
Fuchsia: #d946ef (rgb(217, 70, 239))
Pink:    #ec4899 (rgb(236, 72, 153))
```

### Gradiente Principal
```css
linear-gradient(135deg, 
  #9333ea 0%,    /* Purple */
  #d946ef 50%,   /* Fuchsia */
  #ec4899 100%   /* Pink */
)
```

### Componentes Estilizados
- Botones: Gradiente con hover effect
- Cards: Sombra suave, border purple
- Inputs: Focus ring purple
- NavBar: Sidebar blanco con bordes purple
- Fondos: Gradiente muy suave (alpha: 0.1)

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Start server en puerto 5173

# Producción
npm run build            # Build optimizado para producción
npm run preview          # Preview del build

# Linting
npm run lint             # ESLint check

# Datos (seed)
npm run seed             # Seed Firebase (si implementado)
```

---

## ⚠️ Problemas Comunes

### Problema 1: "npm install falla"
```bash
# Solución: Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

### Problema 2: "No veo .env en el repositorio"
```bash
# Correcto: .env está en .gitignore
# Debes crear .env local desde .env.example
cp .env.example .env
```

### Problema 3: "Login no actualiza NavBar"
```javascript
// El issue es que hay dos eventos diferentes:
// authService.js dispara: template-auth-change
// fakeStoreAuth.js dispara: fakestore-auth-change

// ✅ SOLUCION (ya implementada):
// authService.js escucha AMBOS
window.addEventListener("template-auth-change", handler);
window.addEventListener("fakestore-auth-change", handler);
```

### Problema 4: "Puertos en conflicto"
```bash
# Vite usa puerto 5173 por defecto
# Si está ocupado, prueba:
npm run dev -- --port 3000
```

### Problema 5: "CORS error con API"
```javascript
// No hay problema de CORS con FakeStore API
// Pero si hay error, es generalmente por:
// 1. Red apagada
// 2. FakeStore API caída
// 3. Respuesta se maneja con fallback automático
```

---

## 📱 Responsive Design

### Breakpoints Usados
```css
sm: 640px   - Smartphones
md: 768px   - Tablets
lg: 1024px  - Laptops (donde aparece sidebar)
xl: 1280px  - Desktops
```

### Cambios por Breakpoint
```
Mobile (< 1024px):
- Sidebar oculta por defecto
- Toggle button visible (☰)
- Contenido full width

Desktop (>= 1024px):
- Sidebar siempre visible
- Contenido tiene ml-72 (margin-left)
- Toggle button oculto
```

---

## 🔐 Seguridad

### Lo que se Implementó
- ✅ .env para no exponer URLs en código
- ✅ .gitignore para no subir .env a Git
- ✅ localStorage para sesión (no cookies por ahora)
- ✅ Validación de email en registro

### Qué Falta (Para Producción)
- ❌ HTTPS obligatorio
- ❌ Refresh tokens
- ❌ CSRF protection
- ❌ Password hashing en backend
- ❌ Rate limiting

---

## 🚀 Próximos Pasos (Mejoras Futuras)

### Phase 1: Backend Real
```
[ ] Implementar backend propio
[ ] JWT authentication
[ ] Base de datos real
[ ] Hash de contraseñas
```

### Phase 2: Optimizaciones
```
[ ] Code splitting por rutas
[ ] Image optimization (WebP)
[ ] Lazy load de componentes
[ ] Service Worker (PWA)
```

### Phase 3: Features
```
[ ] Wishlist
[ ] Reviews y ratings
[ ] Categorías dinámicas
[ ] Filtros avanzados
[ ] Historial de órdenes
```

---

## 📞 Contacto y Recursos

### Documentos Incluidos
1. **PROYECTO_RESUMEN_COMPLETO.md** - Resumen visual del proyecto
2. **IMPLEMENTACION_TECNICA_DETALLADA.md** - Detalles técnicos
3. **GUIA_MIGRACION.md** - Este documento

### Links Útiles
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- FakeStore API: https://fakestoreapi.com
- GitHub: https://github.com/Taborda18/Entrega2_FullStack_React

---

## ✅ Checklist Final

```
Antes de compartir a otro equipo:
[ ] .env.example está en repo
[ ] .env está en .gitignore
[ ] npm install funciona
[ ] npm run dev funciona
[ ] Login funciona (johnd / m38rmF$)
[ ] NavBar actualiza al login
[ ] Carrito funciona
[ ] Búsqueda funciona
[ ] npm run build funciona sin errores
[ ] Todos los commits están pusheados
[ ] README.md actualizado
[ ] DOCUMENTACIÓN.md creado
```

---

## 🎓 Para el Otro Chat/Equipo

**Si reciben estos 3 archivos:**

1. **PROYECTO_RESUMEN_COMPLETO.md**
   - Lee esto PRIMERO
   - Entenderás qué hace el proyecto
   - Codes examples listos para copiar-pegar

2. **IMPLEMENTACION_TECNICA_DETALLADA.md**
   - Lee esto para DEBUG
   - Estructura de carpetas detallada
   - Patrones de diseño
   - Solución de problemas

3. **GUIA_MIGRACION.md**
   - Este documento
   - Paso a paso para setup
   - Comandos útiles
   - Checklist

---

**Última actualización**: Mayo 11, 2026  
**Estado del Proyecto**: ✅ Completamente Funcional  
**Listo para Compartir**: SÍ

Buena suerte con el nuevo equipo! 🚀
