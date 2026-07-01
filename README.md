# 🇬🇹 IGM Flow — Despliegue en Vercel

## Pasos para publicar

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create igm-flow --public --push
```

### 2. Conectar con Vercel
- Ve a https://vercel.com → "Add New Project"
- Importa tu repo de GitHub
- Vercel lo detecta automáticamente como un proyecto Node.js

### 3. Configurar Vercel KV
- En el dashboard de Vercel → tu proyecto → "Storage" → "Create Database" → "KV"
- Conecta la base de datos al proyecto (Vercel agrega las variables de entorno automáticamente)

### 4. Configurar el token de admin
- En Vercel → tu proyecto → "Settings" → "Environment Variables"
- Agrega: `ADMIN_TOKEN` = (cualquier texto secreto, ej: `MiTokenSeguro2024`)

### 5. Desplegar
- Vercel despliega automáticamente. Listo.

## URLs
- `tudominio.vercel.app/`       → Vista pública (solo lectura)
- `tudominio.vercel.app/admin`  → Editor (requiere token)

## Flujo de trabajo
1. Ve a `/admin` e ingresa tu token
2. Edita los nodos que necesites (se guardan temporalmente en memoria)
3. Clic en **"☁️ Publicar cambios"**
4. La vista pública (`/`) se actualiza al instante para todos
