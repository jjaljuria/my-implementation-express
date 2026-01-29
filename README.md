# my-implementation-express

Proyecto minimalista que implementa algunas funcionalidades de express.js. Es un proyecto hecho solo por diversión y para aprender.

**Características**
- Estructura sencilla y modular.
- Tests usando el runner de pruebas integrado de Node (`node --test`).
- Scripts útiles para desarrollo y ejecución.

**Requisitos**
- Node.js 18+ (recomendado por `node --test` y `--watch`).
- `pnpm` como gestor de paquetes (el proyecto indica `pnpm@10.x` en `package.json`).

**Instalación**

1. Clona el repositorio:

```bash
git clone <repo-url>
cd my-implementation-express
```

2. Instala dependencias con `pnpm`:

```bash
pnpm install
```

**Scripts disponibles**
- `pnpm dev` — Ejecuta `node --watch index.js` para desarrollo con recarga.
- `pnpm start` — Ejecuta `node test.js` (según `package.json`).
- `pnpm test` — Ejecuta `node --test --watch` (runner de pruebas de Node en modo watch).
- `pnpm coverage` — Ejecuta `node --test --experimental-test-coverage` para cobertura experimental.

Usar con `pnpm` (ejemplo):

```bash
pnpm dev
pnpm test
```

**Estructura del proyecto**
- [index.js](index.js): Punto de entrada de la aplicación.
- [lib/core.js](lib/core.js): Lógica principal / módulo core.
- [lib/router.js](lib/router.js): Enrutamiento o helpers relacionados.
- [test/core.test.js](test/core.test.js): Pruebas para el módulo core.
- [package.json](package.json): Scripts y metadata del proyecto.

**Cómo contribuir**
- Abre un issue para proponer cambios o mejoras.
- Envía pull requests claros y con descripciones.

**Licencia**
Este proyecto está bajo la licencia GPL3 — ver [LICENSE](LICENSE) para detalles.