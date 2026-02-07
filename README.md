# 🛒 BuggyShop - E-commerce con Video Streaming

## ⚠️ ADVERTENCIA IMPORTANTE

**Este proyecto contiene BUGS INTENCIONALES para propósitos educativos.**

NO usar en producción. Es un proyecto de entrenamiento para equipos junior que simula deuda técnica real de una empresa sin procesos establecidos.

---

## 📋 Índice

1. [Descripción](#descripción)
2. [Instalación](#instalación)
3. [Uso](#uso)
4. [Sistema de Niveles](#sistema-de-niveles)
5. [Bugs Documentados](#bugs-documentados)
6. [Misiones Técnicas](#misiones-técnicas)
7. [Deuda Técnica](#deuda-técnica)
8. [Anti-patrones](#anti-patrones)
9. [Escenarios de Crisis](#escenarios-de-crisis)
10. [Roadmap de Refactorización](#roadmap-de-refactorización)
11. [Testing](#testing)
12. [Roles del Equipo](#roles-del-equipo)
13. [Métricas](#métricas)
14. [Checklist de Producción](#checklist-de-producción)
15. [Tabla de Riesgos](#tabla-de-riesgos)
16. [Plan de 8 Semanas](#plan-de-8-semanas)

---

## 🎯 Descripción

BuggyShop es un e-commerce fullstack con streaming de productos en video. Permite:

- ✅ Ver catálogo de productos con videos
- ✅ Búsqueda y filtrado por categoría
- ✅ Carrito de compras persistente
- ✅ Autenticación con JWT
- ✅ Proceso de checkout
- ✅ Panel de administración
- ✅ Upload de videos con generación automática de thumbnails (FFmpeg)
- ✅ Dark mode
- ✅ Diseño responsive

**Stack Tecnológico:**
- Frontend: Vanilla JS, HTML5, CSS3
- Backend: Node.js + Express
- Base de datos: JSON files (simulada)
- Procesamiento: FFmpeg para thumbnails
- Auth: JWT
- Pagos: Stripe (simulado)

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 16+
- FFmpeg instalado en el sistema
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd buggy-ecommerce

# 2. Instalar dependencias
npm install

# 3. Crear carpetas necesarias
mkdir -p uploads/videos uploads/thumbnails

# 4. Iniciar servidor
npm start

# 5. Abrir en navegador
# http://localhost:3000
```

### Instalación de FFmpeg

**Windows:**
```bash
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

---

## 💻 Uso

### Usuarios de Prueba

**Admin:**
- Usuario: `admin`
- Contraseña: `admin123`

**Cliente:**
- Usuario: `user1`
- Contraseña: `password123`

### Flujo Básico

1. Navegar al catálogo
2. Buscar productos
3. Agregar al carrito
4. Iniciar sesión
5. Proceder al checkout
6. Ver historial de pedidos

### Panel Admin

1. Iniciar sesión como admin
2. Ir a Perfil
3. Subir videos de productos
4. Los thumbnails se generan automáticamente

---

## 🎮 Sistema de Niveles

El proyecto está organizado en 5 niveles progresivos de dificultad:

### Level 0: Catálogo Básico 🟢
**Carpeta:** `levels/level-0-locked/`

**Funcionalidades:**
- Listar productos
- Búsqueda básica
- Filtrado por categoría

**Bugs a encontrar (6):**
1. Búsqueda case-sensitive
2. No maneja productos sin imagen
3. Infinite scroll roto
4. Memory leaks en event listeners
5. No limpia event listeners al re-renderizar
6. Console logs olvidados

**Desbloquear:**
```bash
node unlock-levels.js unlock 0
```

---

### Level 1: Sistema de Carrito 🟡
**Carpeta:** `levels/level-1-locked/`

**Funcionalidades:**
- Agregar/remover productos
- Persistencia en localStorage
- Cálculo de totales
- Drawer de carrito

**Bugs a encontrar (7):**
1. Cálculos pueden dar NaN
2. No valida stock disponible
3. localStorage puede llenarse (sin límite)
4. No sincroniza entre pestañas
5. Totales incorrectos con impuestos
6. No valida cantidad mínima
7. Drawer roto en móvil

**Desbloquear:**
```bash
node unlock-levels.js unlock 1
```

---

### Level 2: Autenticación 🟠
**Carpeta:** `levels/level-2-locked/`

**Funcionalidades:**
- Registro de usuarios
- Login con JWT
- Sesión persistente
- Perfil de usuario

**Bugs a encontrar (8):**
1. Passwords en texto plano
2. JWT sin expiración
3. Secret débil (`123456`)
4. No valida inputs (XSS posible)
5. Vulnerable a timing attacks
6. No verifica formato Bearer en token
7. Devuelve password en respuesta de registro
8. Session fixation posible

**Desbloquear:**
```bash
node unlock-levels.js unlock 2
```

---

### Level 3: Checkout y Pagos 🔴
**Carpeta:** `levels/level-3-locked/`

**Funcionalidades:**
- Proceso de pago
- Integración Stripe (fake)
- Historial de órdenes
- Webhooks

**Bugs a encontrar (9):**
1. Race condition en checkout (doble compra)
2. Stock puede ser negativo
3. No verifica autenticación en checkout
4. Webhook sin verificar firma de Stripe
5. Vulnerable a CSRF
6. No valida datos de tarjeta
7. Muestra TODOS los pedidos (no filtra por usuario)
8. ID de orden predecible
9. No maneja errores de pago

**Desbloquear:**
```bash
node unlock-levels.js unlock 3
```

---

### Level 4: Admin + FFmpeg ⚫
**Carpeta:** `levels/level-4-locked/`

**Funcionalidades:**
- Upload de videos
- Generación automática de thumbnails
- Gestión de productos
- Panel administrativo

**Bugs a encontrar (10):**
1. No verifica rol de admin en upload
2. Multer sin límites de tamaño
3. Path traversal en nombres de archivo
4. No verifica si FFmpeg está instalado
5. Leak de streams de video
6. No limpia archivos temporales
7. No valida MIME type
8. Expone stack trace en errores
9. Crash si FFmpeg falla
10. Race condition en generación de thumbnails

**Desbloquear:**
```bash
node unlock-levels.js unlock 4
```

---

## 🐛 Bugs Documentados (30+)

### 🔴 SEGURIDAD (8 bugs)

| # | Bug | Archivo | Línea | Severidad | OWASP |
|---|-----|---------|-------|-----------|-------|
| 1 | XSS en parámetros URL | `index.html` | 78 | CRÍTICA | A03:2021 |
| 2 | JWT con secret débil | `server.js` | 14 | CRÍTICA | A02:2021 |
| 3 | Passwords en texto plano | `server.js` | 78 | CRÍTICA | A02:2021 |
| 4 | CORS permite cualquier origen | `server.js` | 11 | ALTA | A05:2021 |
| 5 | Inyección JSON posible | `server.js` | 95 | ALTA | A03:2021 |
| 6 | Sin rate limiting | `server.js` | 13 | MEDIA | A04:2021 |
| 7 | CSRF en webhook | `server.js` | 165 | ALTA | A01:2021 |
| 8 | Session fixation | `profile.html` | 120 | MEDIA | A07:2021 |

### 🔵 RACE CONDITIONS (5 bugs)

| # | Bug | Archivo | Descripción |
|---|-----|---------|-------------|
| 9 | Doble checkout | `checkout.html` | Click rápido permite doble compra |
| 10 | Stock negativo | `server.js` | No hay locks en actualización de stock |
| 11 | ID colisión | `server.js` | IDs basados en timestamp |
| 12 | Sync tabs roto | `app.js` | No usa storage events |
| 13 | Thumbnail race | `server.js` | Múltiples uploads simultáneos |

### 🟢 FFMPEG (6 bugs)

| # | Bug | Archivo | Descripción |
|---|-----|---------|-------------|
| 14 | Crash sin binario | `server.js` | No verifica instalación |
| 15 | Path traversal | `server.js` | Nombres de archivo no sanitizados |
| 16 | Leak streams | `server.js` | Streams no cerrados |
| 17 | Thumbnails faltantes | `server.js` | No maneja errores de FFmpeg |
| 18 | Archivos temp | `server.js` | No limpia archivos temporales |
| 19 | MIME inválido | `server.js` | No valida tipo de archivo |

### 🟡 FRONTEND (6 bugs)

| # | Bug | Archivo | Descripción |
|---|-----|---------|-------------|
| 20 | Infinite scroll | `app.js` | Dispara en todas las páginas |
| 21 | NaN totals | `cart.html` | Cálculos sin validación |
| 22 | localStorage crash | `app.js` | Sin manejo de QuotaExceeded |
| 23 | Event leaks | `app.js` | Listeners no removidos |
| 24 | Fetch race | `app.js` | Búsqueda sin debounce |
| 25 | Image leaks | `style.css` | Imágenes no liberadas |

### 🟣 BACKEND (5 bugs)

| # | Bug | Archivo | Descripción |
|---|-----|---------|-------------|
| 26 | Multer sin límites | `server.js` | Acepta archivos de cualquier tamaño |
| 27 | Exists sin check | `server.js` | No verifica existencia de archivos |
| 28 | Sync IO | `server.js` | readFileSync bloquea event loop |
| 29 | Swallowed errors | `server.js` | Errores silenciosos |
| 30 | No validation | `server.js` | Inputs sin validar |

---

## 🎯 Misiones Técnicas (15+)

### Misión 1: Seguridad Básica 🛡️
**Objetivo:** Arreglar los 3 bugs de seguridad más críticos

**Tareas:**
1. Implementar bcrypt para passwords
2. Usar secret fuerte desde `.env`
3. Sanitizar inputs para prevenir XSS

**Criterios de éxito:**
- Passwords hasheados en DB
- JWT con secret de 32+ caracteres
- Inputs sanitizados con DOMPurify o similar

**Tiempo estimado:** 4 horas

---

### Misión 2: Race Conditions 🏃
**Objetivo:** Eliminar condiciones de carrera en checkout

**Tareas:**
1. Implementar locks con Redis o in-memory
2. Validar stock atómicamente
3. Prevenir doble submit en frontend

**Criterios de éxito:**
- Stock nunca negativo
- No se crean órdenes duplicadas
- Tests de concurrencia pasan

**Tiempo estimado:** 6 horas

---

### Misión 3: FFmpeg Seguro 🎬
**Objetivo:** Asegurar procesamiento de videos

**Tareas:**
1. Validar MIME type
2. Sanitizar nombres de archivo
3. Verificar instalación de FFmpeg
4. Implementar límites de tamaño

**Criterios de éxito:**
- Solo acepta videos válidos
- No hay path traversal
- Maneja errores gracefully

**Tiempo estimado:** 5 horas

---

### Misión 4: Performance Frontend ⚡
**Objetivo:** Eliminar memory leaks y optimizar

**Tareas:**
1. Limpiar event listeners
2. Implementar debounce en búsqueda
3. Lazy loading de imágenes
4. Remover infinite scroll o arreglarlo

**Criterios de éxito:**
- No hay memory leaks (verificar con DevTools)
- Búsqueda no hace requests excesivos
- Imágenes cargan bajo demanda

**Tiempo estimado:** 4 horas

---

### Misión 5: Testing Real 🧪
**Objetivo:** Escribir tests que realmente validen funcionalidad

**Tareas:**
1. Tests de integración para API
2. Tests de seguridad (intentar XSS, SQL injection)
3. Tests de concurrencia
4. Tests E2E con Playwright

**Criterios de éxito:**
- Cobertura > 70%
- Tests detectan bugs existentes
- CI/CD configurado

**Tiempo estimado:** 8 horas

---

### Misión 6: Autenticación Robusta 🔐
**Objetivo:** Implementar auth seguro

**Tareas:**
1. JWT con expiración y refresh tokens
2. Rate limiting en login
3. Protección contra timing attacks
4. 2FA opcional

**Criterios de éxito:**
- Tokens expiran en 15 minutos
- Max 5 intentos de login por minuto
- Comparación de passwords en tiempo constante

**Tiempo estimado:** 6 horas

---

### Misión 7: Validación de Inputs 📝
**Objetivo:** Validar todos los inputs del usuario

**Tareas:**
1. Implementar Joi o Zod para validación
2. Sanitizar en backend y frontend
3. Mensajes de error claros
4. Validación de tipos MIME

**Criterios de éxito:**
- Todos los endpoints validan inputs
- Rechaza datos inválidos con 400
- No hay inyecciones posibles

**Tiempo estimado:** 5 horas

---

### Misión 8: Manejo de Errores 🚨
**Objetivo:** Implementar manejo de errores robusto

**Tareas:**
1. Middleware de errores global
2. Logging con Winston o Pino
3. No exponer stack traces
4. Retry logic para operaciones críticas

**Criterios de éxito:**
- Errores loggeados correctamente
- Usuario ve mensajes amigables
- Sistema no crashea

**Tiempo estimado:** 4 horas

---

### Misión 9: Base de Datos Real 💾
**Objetivo:** Migrar de JSON a base de datos real

**Tareas:**
1. Elegir DB (PostgreSQL, MongoDB)
2. Diseñar schema
3. Implementar migrations
4. Transacciones para operaciones críticas

**Criterios de éxito:**
- Datos persistentes en DB
- Operaciones atómicas
- Backups configurados

**Tiempo estimado:** 12 horas

---

### Misión 10: Carrito Sincronizado 🔄
**Objetivo:** Sincronizar carrito entre pestañas

**Tareas:**
1. Usar Storage Events API
2. Implementar broadcast channel
3. Resolver conflictos de merge
4. Persistir en backend para usuarios logueados

**Criterios de éxito:**
- Cambios se reflejan en todas las pestañas
- No hay pérdida de datos
- Funciona offline

**Tiempo estimado:** 4 horas

---

### Misión 11: Paginación 📄
**Objetivo:** Implementar paginación correcta

**Tareas:**
1. Endpoint con limit/offset
2. Cursor-based pagination
3. UI de paginación
4. Infinite scroll arreglado (opcional)

**Criterios de éxito:**
- Carga solo 20 productos por página
- Performance mejorada
- UX fluida

**Tiempo estimado:** 3 horas

---

### Misión 12: CORS Correcto 🌐
**Objetivo:** Configurar CORS apropiadamente

**Tareas:**
1. Whitelist de orígenes permitidos
2. Configurar headers correctamente
3. Preflight requests
4. Credentials handling

**Criterios de éxito:**
- Solo orígenes autorizados
- No hay errores CORS
- Seguridad mejorada

**Tiempo estimado:** 2 horas

---

### Misión 13: Rate Limiting ⏱️
**Objetivo:** Prevenir abuso de API

**Tareas:**
1. Implementar express-rate-limit
2. Diferentes límites por endpoint
3. Redis para rate limiting distribuido
4. Mensajes claros de límite excedido

**Criterios de éxito:**
- Login: 5 req/min
- API: 100 req/min
- Upload: 3 req/hora

**Tiempo estimado:** 3 horas

---

### Misión 14: Webhooks Seguros 🔗
**Objetivo:** Verificar webhooks de Stripe

**Tareas:**
1. Validar firma de Stripe
2. Idempotencia en procesamiento
3. Retry logic
4. Logging de webhooks

**Criterios de éxito:**
- Solo procesa webhooks legítimos
- No procesa duplicados
- Maneja fallos gracefully

**Tiempo estimado:** 4 horas

---

### Misión 15: Monitoreo 📊
**Objetivo:** Implementar observabilidad

**Tareas:**
1. Logging estructurado
2. Métricas con Prometheus
3. Alertas básicas
4. Health checks

**Criterios de éxito:**
- Logs centralizados
- Dashboards de métricas
- Alertas en Slack/email

**Tiempo estimado:** 6 horas

---

## 💸 Deuda Técnica

### Deuda Arquitectural
- **JSON como DB:** No escalable, sin transacciones
- **Sync I/O:** Bloquea event loop
- **Sin capas:** Lógica mezclada en rutas
- **Sin DTOs:** Validación inconsistente

**Impacto:** Alto  
**Esfuerzo:** 2 semanas

---

### Deuda de Seguridad
- **Passwords plaintext:** Crítico
- **JWT débil:** Crítico
- **Sin validación:** Alto riesgo
- **CORS abierto:** Exposición

**Impacto:** Crítico  
**Esfuerzo:** 1 semana

---

### Deuda de Testing
- **Tests vacíos:** No detectan bugs
- **Sin E2E:** No valida flujos
- **Sin CI/CD:** Deploys manuales
- **Sin coverage:** Desconocido

**Impacto:** Alto  
**Esfuerzo:** 1 semana

---

### Deuda de Performance
- **Memory leaks:** Degrada con uso
- **Sin caching:** Requests redundantes
- **Sin CDN:** Assets lentos
- **Sin compresión:** Payloads grandes

**Impacto:** Medio  
**Esfuerzo:** 3 días

---

### Deuda de UX
- **Errores genéricos:** Confusos
- **Sin loading states:** Parece roto
- **Sin validación frontend:** Mala UX
- **Responsive roto:** Móvil malo

**Impacto:** Medio  
**Esfuerzo:** 1 semana

---

## 🚫 Anti-patrones

### 1. God Object
**Ubicación:** `app.js`  
**Problema:** Archivo hace todo (carrito, auth, UI)  
**Solución:** Separar en módulos

### 2. Magic Numbers
**Ubicación:** `cart.html` línea 95  
**Problema:** `subtotal * 0.16` sin constante  
**Solución:** `const TAX_RATE = 0.16`

### 3. Callback Hell
**Ubicación:** `server.js` línea 145  
**Problema:** Callbacks anidados  
**Solución:** Usar async/await

### 4. Hardcoded Secrets
**Ubicación:** `server.js` línea 14  
**Problema:** Secret en código  
**Solución:** Variables de entorno

### 5. Swallowed Exceptions
**Ubicación:** `server.js` línea 38  
**Problema:** `catch` vacío  
**Solución:** Logging apropiado

### 6. Spaghetti Code
**Ubicación:** `app.js`  
**Problema:** Lógica sin estructura  
**Solución:** Arquitectura en capas

### 7. Copy-Paste Programming
**Ubicación:** Múltiples archivos  
**Problema:** Código duplicado  
**Solución:** DRY principle

### 8. Premature Optimization
**Ubicación:** `style.css`  
**Problema:** Animaciones complejas innecesarias  
**Solución:** Simplicidad primero

---

## 🔥 Escenarios de Crisis

### Escenario 1: Black Friday 🛍️
**Situación:** Tráfico 100x normal

**Problemas que surgirán:**
1. Stock negativo por race conditions
2. Server crash por sync I/O
3. localStorage lleno en clientes
4. FFmpeg colapsa con uploads masivos
5. JWT secret expuesto en logs

**Ejercicio:**
- Simular con Artillery/k6
- Identificar cuellos de botella
- Implementar soluciones
- Documentar post-mortem

---

### Escenario 2: Ataque de Seguridad 🔓
**Situación:** Hacker encuentra vulnerabilidades

**Ataques posibles:**
1. XSS en búsqueda
2. JWT hijacking
3. Path traversal en uploads
4. CSRF en webhook
5. Timing attack en login

**Ejercicio:**
- Ejecutar cada ataque
- Documentar impacto
- Implementar mitigaciones
- Crear security checklist

---

### Escenario 3: Pérdida de Datos 💥
**Situación:** Archivo `orders.json` corrupto

**Problemas:**
1. No hay backups
2. No hay transacciones
3. Datos inconsistentes
4. Usuarios afectados

**Ejercicio:**
- Simular corrupción
- Intentar recuperar datos
- Implementar backups
- Plan de disaster recovery

---

### Escenario 4: Nuevo Dev en Equipo 👨‍💻
**Situación:** Junior sin contexto hace cambios

**Problemas:**
1. Rompe funcionalidad existente
2. Introduce más bugs
3. No entiende arquitectura
4. Sin documentación

**Ejercicio:**
- Onboarding process
- Code review checklist
- Documentación técnica
- Pair programming

---

### Escenario 5: Migración a Producción 🚀
**Situación:** Deploy a servidor real

**Problemas:**
1. FFmpeg no instalado
2. Puertos hardcodeados
3. CORS bloquea frontend
4. Secrets expuestos
5. Sin HTTPS

**Ejercicio:**
- Crear Dockerfile
- Variables de entorno
- Reverse proxy (nginx)
- SSL/TLS
- Monitoring

---

## 🗺️ Roadmap de Refactorización

### Fase 1: Estabilización (Semana 1-2)
**Objetivo:** Hacer el sistema funcional y seguro

**Tareas:**
- [ ] Arreglar bugs críticos de seguridad
- [ ] Implementar bcrypt
- [ ] JWT con expiración
- [ ] Validación básica de inputs
- [ ] Manejo de errores global
- [ ] Logging básico

**Entregables:**
- Sistema sin vulnerabilidades críticas
- Tests de seguridad pasando

---

### Fase 2: Arquitectura (Semana 3-4)
**Objetivo:** Separar responsabilidades

**Tareas:**
- [ ] Migrar a base de datos real
- [ ] Implementar capas (routes, services, repositories)
- [ ] DTOs y validación con Joi
- [ ] Separar frontend en módulos
- [ ] Configuración centralizada

**Entregables:**
- Código organizado en capas
- DB con migrations

---

### Fase 3: Performance (Semana 5-6)
**Objetivo:** Optimizar rendimiento

**Tareas:**
- [ ] Eliminar memory leaks
- [ ] Implementar caching (Redis)
- [ ] CDN para assets
- [ ] Compresión gzip
- [ ] Lazy loading
- [ ] Paginación

**Entregables:**
- Lighthouse score > 90
- Sin memory leaks

---

### Fase 4: Testing (Semana 7)
**Objetivo:** Cobertura de tests

**Tareas:**
- [ ] Tests unitarios (70%+ coverage)
- [ ] Tests de integración
- [ ] Tests E2E con Playwright
- [ ] Tests de carga
- [ ] CI/CD pipeline

**Entregables:**
- Suite de tests completa
- CI/CD funcionando

---

### Fase 5: Producción (Semana 8)
**Objetivo:** Production-ready

**Tareas:**
- [ ] Containerización (Docker)
- [ ] Orquestación (k8s opcional)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Alertas
- [ ] Backups automáticos
- [ ] Disaster recovery plan

**Entregables:**
- Sistema deployable
- Documentación completa

---

## 🧪 Testing

### Estructura de Tests

```
tests/
├── unit/
│   ├── auth.test.js
│   ├── cart.test.js
│   └── products.test.js
├── integration/
│   └── api.test.js
├── e2e/
│   └── checkout.spec.js
└── load/
    └── artillery.yml
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# E2E
npm run test:e2e

# Load testing
npm run test:load
```

### Tests Actuales (ROTOS)

Los tests en `tests/api.test.js` están intencionalmente rotos:

**Problemas:**
1. Tests vacíos que siempre pasan
2. No hacen requests reales
3. Datos hardcodeados
4. False positives
5. Tests comentados

**Ejercicio:** Reescribir todos los tests correctamente

---

## 👥 Roles del Equipo

### Tech Lead
**Responsabilidades:**
- Arquitectura general
- Code reviews
- Mentoring
- Decisiones técnicas

**Tareas en este proyecto:**
- Diseñar refactorización
- Establecer estándares
- Revisar PRs críticos

---

### Backend Developer
**Responsabilidades:**
- API development
- Base de datos
- Seguridad
- Performance

**Tareas en este proyecto:**
- Arreglar bugs de backend
- Migrar a DB real
- Implementar auth robusto
- Optimizar queries

---

### Frontend Developer
**Responsabilidades:**
- UI/UX
- Estado de aplicación
- Performance frontend
- Accesibilidad

**Tareas en este proyecto:**
- Arreglar memory leaks
- Mejorar UX
- Responsive design
- Optimizar assets

---

### DevOps Engineer
**Responsabilidades:**
- CI/CD
- Infraestructura
- Monitoring
- Deployments

**Tareas en este proyecto:**
- Dockerizar aplicación
- Setup CI/CD
- Configurar monitoring
- Automatizar deploys

---

### QA Engineer
**Responsabilidades:**
- Testing
- Automatización
- Bugs tracking
- Quality gates

**Tareas en este proyecto:**
- Escribir tests reales
- Tests de seguridad
- Tests de carga
- Documentar bugs

---

## 📊 Métricas

### Métricas Actuales (MALAS)

| Métrica | Valor | Objetivo |
|---------|-------|----------|
| Test Coverage | 0% | 80% |
| Bugs Críticos | 30+ | 0 |
| Vulnerabilidades | 15+ | 0 |
| Performance Score | 45 | 90+ |
| Uptime | 60% | 99.9% |
| MTTR | 2 días | 1 hora |
| Deploy Frequency | Manual | Diario |
| Lead Time | 1 semana | 1 día |

### Métricas de Código

```bash
# Complejidad ciclomática
npm run complexity

# Duplicación
npm run duplication

# Deuda técnica (horas)
npm run tech-debt
```

---

## ✅ Checklist de Producción

### Seguridad
- [ ] Passwords hasheados
- [ ] JWT con expiración
- [ ] Inputs validados
- [ ] CORS configurado
- [ ] Rate limiting
- [ ] HTTPS
- [ ] Secrets en variables de entorno
- [ ] Sin datos sensibles en logs
- [ ] Headers de seguridad
- [ ] Dependencias actualizadas

### Performance
- [ ] Sin memory leaks
- [ ] Caching implementado
- [ ] Assets comprimidos
- [ ] CDN configurado
- [ ] Lazy loading
- [ ] Paginación
- [ ] Índices en DB
- [ ] Connection pooling

### Reliability
- [ ] Manejo de errores
- [ ] Logging centralizado
- [ ] Monitoring
- [ ] Alertas
- [ ] Backups automáticos
- [ ] Health checks
- [ ] Graceful shutdown
- [ ] Retry logic

### Testing
- [ ] Tests unitarios > 70%
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] Tests de carga
- [ ] Tests de seguridad
- [ ] CI/CD pipeline

### Documentación
- [ ] README actualizado
- [ ] API documentation
- [ ] Arquitectura documentada
- [ ] Runbooks
- [ ] Onboarding guide

---

## ⚠️ Tabla de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos | Alta | Crítico | Migrar a DB + Backups |
| Brecha de seguridad | Alta | Crítico | Arreglar bugs de seguridad |
| Caída en producción | Alta | Alto | Monitoring + Alertas |
| Stock negativo | Alta | Alto | Transacciones atómicas |
| Memory leaks | Media | Alto | Profiling + Fixes |
| FFmpeg crash | Media | Medio | Validación + Error handling |
| localStorage lleno | Media | Medio | Límites + Backend sync |
| CORS issues | Baja | Medio | Configuración correcta |
| Vendor lock-in | Baja | Bajo | Abstracciones |

---

## 📅 Plan de 8 Semanas

### Semana 1: Onboarding y Análisis
**Objetivos:**
- Entender el proyecto
- Identificar todos los bugs
- Priorizar trabajo

**Actividades:**
- Setup local
- Explorar código
- Documentar bugs encontrados
- Crear backlog

**Entregables:**
- Lista completa de bugs
- Backlog priorizado
- Plan de ataque

---

### Semana 2: Seguridad Crítica
**Objetivos:**
- Eliminar vulnerabilidades críticas
- Implementar auth seguro

**Actividades:**
- Implementar bcrypt
- JWT robusto
- Validación de inputs
- Sanitización XSS

**Entregables:**
- 0 vulnerabilidades críticas
- Tests de seguridad pasando

---

### Semana 3: Backend Refactor
**Objetivos:**
- Migrar a DB real
- Arquitectura en capas

**Actividades:**
- Setup PostgreSQL/MongoDB
- Migrations
- Services layer
- Repositories

**Entregables:**
- DB funcionando
- Código organizado

---

### Semana 4: Race Conditions
**Objetivos:**
- Eliminar bugs de concurrencia
- Transacciones atómicas

**Actividades:**
- Implementar locks
- Validación de stock
- Prevenir doble submit
- Tests de concurrencia

**Entregables:**
- Stock siempre correcto
- No hay órdenes duplicadas

---

### Semana 5: Frontend Optimization
**Objetivos:**
- Eliminar memory leaks
- Mejorar performance

**Actividades:**
- Limpiar event listeners
- Debounce en búsqueda
- Lazy loading
- Code splitting

**Entregables:**
- Lighthouse > 90
- Sin memory leaks

---

### Semana 6: Testing
**Objetivos:**
- Cobertura > 70%
- CI/CD funcionando

**Actividades:**
- Tests unitarios
- Tests de integración
- Tests E2E
- Setup CI/CD

**Entregables:**
- Suite de tests completa
- Pipeline automatizado

---

### Semana 7: DevOps
**Objetivos:**
- Containerización
- Monitoring

**Actividades:**
- Dockerfile
- Docker Compose
- Prometheus + Grafana
- Alertas

**Entregables:**
- App containerizada
- Dashboards de métricas

---

### Semana 8: Producción
**Objetivos:**
- Deploy a producción
- Documentación final

**Actividades:**
- Deploy a cloud
- SSL/TLS
- Backups
- Runbooks
- Post-mortem

**Entregables:**
- App en producción
- Documentación completa
- Presentación final

---

## 🎓 Aprendizajes Esperados

Al completar este proyecto, habrás aprendido:

✅ Debugging de aplicaciones reales  
✅ Seguridad web (OWASP Top 10)  
✅ Manejo de estado en frontend  
✅ Concurrencia y race conditions  
✅ Optimización de performance  
✅ Arquitectura de software  
✅ Testing (unit, integration, E2E)  
✅ DevOps y CI/CD  
✅ Trabajo en equipo  
✅ Code review  
✅ Documentación técnica  
✅ Gestión de deuda técnica  

---

## 📞 Soporte

Este es un proyecto educativo. Para preguntas:

1. Revisar documentación de niveles
2. Consultar tabla de bugs
3. Buscar en issues de GitHub
4. Preguntar al Tech Lead

---

## 📜 Licencia

MIT License - Proyecto educativo

---

## 🙏 Agradecimientos

Este proyecto simula deuda técnica real para entrenar equipos junior.

**NO** usar en producción.  
**SÍ** usar para aprender.

¡Buena suerte arreglando todos los bugs! 🐛🔨
