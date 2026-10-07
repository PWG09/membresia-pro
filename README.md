# MembresíaPro ⚡

**Plataforma de herramientas premium para creadores** que genera ingresos mediante suscripciones y membresías.

## 🚀 Descripción

MembresíaPro es una aplicación web completa y funcional orientada a freelancers, creadores de contenido y emprendedores digitales. Ofrece herramientas de productividad e IA (simuladas de forma inteligente) detrás de un sistema de membresías con tres planes:

| Plan       | Precio     | Características principales                          |
|------------|------------|------------------------------------------------------|
| **Free**   | $0         | 5 prompts/día, 3 ideas/día, calculadora, recursos básicos |
| **Pro**    | $12/mes    | Ilimitado + biblioteca premium + exportaciones       |
| **Business** | $29/mes  | Todo Pro + equipos + soporte prioritario             |

### Herramientas incluidas

1. **Generador de Prompts IA** — Prompts optimizados para ChatGPT, Claude, Midjourney, scripts de video, emails y código.
2. **Ideas de Contenido** — Genera ideas virales adaptadas a Instagram, TikTok, YouTube, LinkedIn, Blog y Newsletter.
3. **Calculadora de Precios Freelance** — Calcula precios justos según horas, experiencia, margen y gastos.
4. **Biblioteca de Recursos** — Plantillas de contratos, propuestas, emails, checklists (contenido premium bloqueado).

## 💰 Modelo de ingresos

- **Suscripciones mensuales / anuales** (20% de descuento anual).
- Plan Free como embudo de conversión.
- Upsell claro dentro del dashboard cuando se alcanzan límites.
- Ideal para conectar con Stripe / LemonSqueezy / Paddle en producción.

## 🛠 Tecnologías

- HTML5 semántico
- CSS3 moderno (variables, grid, flex, glassmorphism, responsive)
- JavaScript vanilla (sin dependencias)
- localStorage para persistencia de usuario y uso
- Diseño dark-first, tipografía Inter

## ▶️ Cómo ejecutar

Simplemente abre `index.html` en cualquier navegador moderno.

```bash
# Opción 1: abrir directamente
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Opción 2: servidor local (recomendado)
npx serve .
# o
python3 -m http.server 3000
```

Luego visita `http://localhost:3000`.

## 📁 Estructura

```
membresia-pro/
├── index.html      # Estructura completa de la app
├── styles.css      # Estilos (dark theme, responsive)
├── app.js          # Lógica: auth, planes, herramientas, estado
└── README.md
```

## 🔑 Características técnicas

- Autenticación simulada (registro / login con localStorage)
- Gestión de planes y límites diarios por plan Free
- Dashboard completo con sidebar
- Modal de autenticación
- Sistema de toasts
- Contador de uso mensual
- Responsive (móvil + desktop)
- Sin errores de consola, código limpio

## 🚀 Próximos pasos para producción

1. Conectar autenticación real (Firebase Auth / Supabase / Clerk)
2. Integrar pasarela de pagos (Stripe Checkout + webhooks)
3. Backend real (Node/Express o Next.js API routes)
4. Base de datos para usuarios y uso
5. Deploy en Vercel / Netlify / Cloudflare Pages
6. Dominio propio + analytics

## 📄 Licencia

MIT — Úsalo, modifícalo y genera ingresos con él.

---

Hecho con ❤️ para creadores que quieren monetizar su conocimiento y herramientas.
