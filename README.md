# TEST Idiomas · Landing Page B2B Corporativa

Landing page comercial y de captación de leads orientada al segmento corporativo (**B2B**), diseñada para presentar y cotizar programas de **inglés especializado para empresas, hoteles, clínicas y organizaciones**.

---

## 🎯 Objetivo del Sitio Web

Convertir prospectos institucionales (Directores de RRHH, Gerentes de Capacitación, Directores de Operaciones y Líderes de Área) en oportunidades comerciales mediante:
1. Presentación clara de las **5 especialidades de inglés técnico** adaptadas al puesto de trabajo.
2. Oferta de valor con **diagnóstico inicial sin costo** para el personal de la empresa.
3. Transparencia en la metodología, reportes de desempeño y beneficios corporativos.
4. Un **formulario de cotización interactivo** de alta conversión con respuesta inmediata.

---

## 👥 Público Objetivo

- **Empresas del sector turístico y hotelero**: Cadenas de hoteles, resorts, agencias y operadores receptivos.
- **Restaurantes y grupos gastronómicos**: Chefs, brigadas de cocina y personal de servicio de sala.
- **Instituciones médicas y de salud**: Clínicas, hospitales con turismo médico y centros de diagnóstico.
- **Empresas corporativas y financieras**: Equipos de ventas internacionales, finanzas y operaciones.
- **Departamentos de Recursos Humanos y Capacitación (L&D)**.

---

## 📚 Especialidades y Programas Formativos

El sitio destaca 5 módulos clave con currícula técnica y vocabulario aplicado:

| Especialidad | Enfoque Principal |
| :--- | :--- |
| **Hospitalidad y Turismo** | Recepción, concierge, atención a huéspedes VIP y resolución de incidencias. |
| **Inglés Gastronómico** | Términos culinarios, servicio en mesa, maridaje y alérgenos alimentarios. |
| **Inglés Médico** | Consulta clínica, terminología médica, consentimientos y urgencias con pacientes angloparlantes. |
| **Negocios y Finanzas** | Negociaciones ejecutivas, presentaciones de impacto, contratos y correos comerciales. |
| **Turismo Fundamental** | Guías turísticos, transportación, logística y atención al visitante internacional. |

---

## 🧭 Estructura y Secciones de la Landing

1. **Header Sticky & Navegación**: Acceso directo a secciones y botón de contacto prioritario (*Cotizar para mi empresa*).
2. **Hero Section**: Promesa de valor principal, métricas de confianza, insignias de calidad y doble CTA de conversión.
3. **Marquee de Confianza**: Cinta continua de industrias y perfiles que utilizan la plataforma.
4. **Módulo de Diagnóstico Gratuito**: Invitación a evaluar el nivel del equipo sin costo previo.
5. **Especialidades Interactivas (Tabs Dinámicos)**: Explorador de contenidos, competencias desarrolladas y temarios por industria.
6. **Metodología y Ventajas B2B**: Detalle del seguimiento a RRHH (asistencia, progreso, exámenes y reportes mensuales).
7. **Preguntas Frecuentes (Acordeón FAQ)**: Dudas habituales sobre horarios flexibles, niveles MCER (A1 a C1) y certificaciones.
8. **Formulario de Cotización**: Captura estructurada de datos (empresa, participantes, industria y objetivos) con pantalla de éxito dinámica.
9. **Footer Corporativo**: Información de soporte técnico, horarios de atención (GMT-6) y aviso de privacidad.

---

## 🎨 Identidad Visual y Paleta de Color

- **Fondo base (`crema`)**: `#fbf7f1`
- **Texto principal / fondos oscuros (`tinta`)**: `#17132b`
- **Acento primario (`violeta`)**: `#6b3cff`
- **Acento de contraste y éxito (`lima`)**: `#c9f45c`
- **Colores secundarios de soporte**: Coral (`#ff6b4a`), Cielo (`#4cc2f5`), Menta (`#38d39f`), Sol (`#ffc93c`).
- **Tipografías**:
  - Títulos y encabezados: **Bricolage Grotesque**
  - Textos de lectura y componentes: **Plus Jakarta Sans**

---

## 🛠️ Arquitectura Técnica

- **HTML5 Semántico**: Marcado limpio con accesibilidad, etiquetas de sección y optimización SEO.
- **Tailwind CSS 3.4**: Sistema de diseño basado en utilidades con purga automática para producción.
- **JavaScript Moderno (ES Modules)**:
  - Menú hamburguesa móvil reactivo.
  - Conmutador dinámico de pestañas de especialidades.
  - Acordeón FAQ accesible.
  - Manejador de envío de formulario asíncrono con confirmación visual.
  - Scroll suave con compensación de barra de navegación fija.
- **Vite 5**: Entorno de desarrollo ultrarrápido y empaquetador para producción.

---

## 📁 Archivos del Proyecto

```text
D:\TestLanding\
├── index.html            # Marcado semántico de la landing
├── css/
│   └── style.css         # Directivas Tailwind y componentes personalizados
├── js/
│   └── main.js           # Lógica interactiva en Vanilla JS
├── tailwind.config.js    # Tokens de diseño (colores, fuentes y breakpoints)
├── postcss.config.js     # Configuración de PostCSS
├── package.json          # Dependencias y scripts npm
├── README.md             # Documentación del proyecto
└── dist/                 # Archivos finales minificados listos para desplegar
```

---

## ⚡ Comandos de Trabajo

```bash
# Iniciar servidor de desarrollo en tiempo real (http://localhost:5173)
npm run dev

# Generar versión optimizada para producción en carpeta dist/
npm run build

# Probar localmente el resultado de producción
npm run preview
```
