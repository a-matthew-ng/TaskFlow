# TaskFlow

## Descripción

TaskFlow es una aplicación móvil desarrollada con Ionic y Angular para la gestión de tareas. Permite visualizar tareas organizadas por categorías, crear nuevas tareas, editar su información y marcar tareas como completadas.

La aplicación utiliza almacenamiento local para persistir la información y ha sido preparada para ejecutarse tanto en Android como en iOS mediante Capacitor.

---

## Tecnologías utilizadas

* Ionic Framework
* Angular
* TypeScript
* Capacitor
* SCSS
* Android (Capacitor Android)
* iOS (Capacitor iOS)

---

## Requisitos

### Node.js

Se recomienda utilizar Node.js 22 o superior.

Verificar la versión instalada:

```bash
node -v
```

### Ionic CLI

Instalar Ionic CLI:

```bash
npm install -g @ionic/cli
```

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/a-matthew-ng/TaskFlow
```

Entrar al proyecto:

```bash
cd TaskFlow
```

Instalar las dependencias:

```bash
npm install
```

---

# Ejecución en navegador

Iniciar el servidor de desarrollo:

```bash
ionic serve
```

La aplicación estará disponible en:

```text
http://localhost:8100
```

---

# Ejecución en Android

## Sincronizar Capacitor

```bash
ionic build
npx cap sync android
```

## Abrir Android Studio

```bash
npx cap open android
```

## Generar APK mediante línea de comandos

Entrar al proyecto Android:

```bash
cd android
```

Generar APK de depuración:

```bash
gradlew assembleDebug
```

La APK se genera en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

# Compatibilidad con iOS

El proyecto incluye configuración para iOS mediante Capacitor.

Sincronizar iOS:

```bash
npm install @capacitor/ios
ionic build
npx cap sync ios
```

Se incluyó un flujo de GitHub Actions para verificar la generación del proyecto nativo iOS utilizando un entorno macOS.

Debido a las restricciones del ecosistema de Apple, la generación de una IPA firmada requiere certificados y acceso a Xcode.

---

# Cambios realizados

## Interfaz

* Implementación de una interfaz moderna basada en Ionic.
* Organización visual de tareas mediante tarjetas.
* Mejoras visuales y estilos personalizados.
* Ajustes para evitar superposición con la barra de estado del dispositivo.

## Gestión de tareas

* Creación de tareas.
* Edición de tareas existentes.
* Eliminación de tareas.
* Marcado de tareas como completadas.
* Filtrado por categorías.

## Persistencia

* Implementación del almacenamiento local para conservar la información entre sesiones.

## Arquitectura

Se utilizó una arquitectura basada en:

* Pages
* Services
* Models

La lógica de negocio fue desacoplada de la interfaz mediante servicios dedicados.

## Capacitor

Se agregó soporte para:

* Android
* iOS

Se incorporó la configuración correspondiente en:

* capacitor.config.ts
* android/
* iOS mediante GitHub Actions

---

# Estructura del proyecto

```text
src
├── app
│   ├── models
│   ├── pages
│   ├── services
│   └── components
├── assets
├── theme
└── global.scss
```

---

# Scripts disponibles

Ejecutar en desarrollo:

```bash
ionic serve
```

Compilar:

```bash
ionic build
```

Sincronizar Android:

```bash
npx cap sync android
```

Sincronizar iOS:

```bash
npx cap sync ios
```

Abrir Android Studio:

```bash
npx cap open android
```

---

# Repositorio

El código fuente actualizado se encuentra versionado mediante Git e incluye todos los cambios realizados durante el desarrollo de la prueba técnica.
