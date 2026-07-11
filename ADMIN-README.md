# Panel de administración — Six 7 Cup

El sitio ahora carga su contenido (pilotos, constructores, calendario, resultados, equipos, info de la liga y noticias) desde archivos en la carpeta `data/`. El panel `admin.html` te permite editar esos archivos y subir los cambios directo a GitHub, sin tocar código.

## Cómo acceder

1. Sube este paquete completo a tu repositorio de GitHub (reemplazando lo que ya tenías).
2. Entra a `https://tuusuario.github.io/turepo/admin.html` (o la ruta equivalente de tu sitio).
3. El panel no está enlazado desde el menú del sitio a propósito, para no exponerlo a los visitantes. Guarda esa URL para ti.

## Primera vez: conectar tu repositorio

1. Ve a [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) y crea un **Fine-grained personal access token**.
2. En "Repository access", selecciona **solo** el repositorio de este sitio (no des acceso a todos tus repos).
3. En "Permissions", busca **Contents** y ponlo en **Read and write**.
4. Genera el token y cópialo (empieza con `github_pat_...`). Solo se muestra una vez.
5. En el panel, llena:
   - **Usuario u organización**: tu usuario de GitHub
   - **Repositorio**: el nombre del repo (ej. `six7cup-web`)
   - **Rama**: normalmente `main`
   - **Carpeta de datos**: `data` (ya viene así)
   - **Token**: el que generaste
6. Dale a "Conectar". El token se guarda solo en tu navegador (localStorage), nunca se envía a otro lado que no sea `api.github.com`.

## Uso diario

- Cada sección del menú lateral (Pilotos, Constructores, Calendario, Resultados, Equipos, Info de la liga, Noticias) edita un archivo JSON distinto.
- Cambia lo que necesites y dale a **"Guardar en GitHub"** en esa sección — sube un commit directo a tu repo.
- Los cambios tardan 1-2 minutos en reflejarse en tu web (tiempo normal de GitHub Pages).
- Si trabajas en varias pestañas o dispositivos, usa "Recargar" antes de editar para traer la versión más reciente y evitar sobrescribir cambios de otra persona.

## Seguridad

- Cualquiera con el token puede editar el contenido del repo — trátalo como una contraseña.
- Si crees que se filtró, revócalo en GitHub (Settings → Developer settings → Tokens) y genera uno nuevo.
- El panel no tiene login propio: el token de GitHub **es** el control de acceso.

## Si algo no carga

- Revisa que el repositorio, usuario y rama estén bien escritos (mayúsculas incluidas).
- Revisa que el token tenga permiso de **Contents: Read and write** sobre ese repositorio específico.
- Abre la consola del navegador (F12) para ver el mensaje de error exacto si el panel dice "No se pudo cargar/guardar".
