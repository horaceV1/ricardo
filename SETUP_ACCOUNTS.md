# 🚀 Guia Rápido: Sistema de Contas

## ⚡ Configuração Rápida (5 minutos)

### 1️⃣ Backend Drupal

Acesse seu backend Drupal e execute:

```bash
# Instalar Simple OAuth
composer require drupal/simple_oauth
drush en simple_oauth -y
```

### 2️⃣ Criar OAuth Consumer

1. Acesse: `https://darkcyan-stork-408379.hostingersite.com/admin/config/services/consumer/add`
2. Preencha:
   - **Label**: Next.js Frontend
   - **Client ID**: `nextjs-clinica-frontend`
   - **Secret**: `gerar-uma-string-segura-aqui`
   - Marque: ✅ Password Grant e ✅ Refresh Token Grant
3. Clique em **Save**

### 3️⃣ Frontend - Atualizar `.env.local`

```env
NEXT_PUBLIC_DRUPAL_BASE_URL=https://darkcyan-stork-408379.hostingersite.com
NEXT_PUBLIC_DRUPAL_CLIENT_ID=nextjs-clinica-frontend
NEXT_PUBLIC_DRUPAL_CLIENT_SECRET=sua-secret-aqui
DRUPAL_CLIENT_ID=nextjs-clinica-frontend
DRUPAL_CLIENT_SECRET=sua-secret-aqui
```

### 4️⃣ Testar

```bash
cd ricardo
npm run dev
```

Acesse: `http://localhost:3000/cadastrar`

## 📍 Rotas Disponíveis

| Rota | Descrição | Requer Auth |
|------|-----------|-------------|
| `/entrar` | Login | ❌ |
| `/cadastrar` | Registro | ❌ |
| `/conta` | Dashboard | ✅ |

## 🎯 Funcionalidades

✅ **Login** - Autenticação com usuários do Drupal  
✅ **Registro** - Criar novas contas  
✅ **Dashboard** - Visualizar informações da conta  
✅ **Permissões** - Controle baseado em roles do Drupal  
✅ **Logout** - Desconectar e revogar tokens  
✅ **Menu de Usuário** - No header, quando logado  
✅ **Proteção de Rotas** - Páginas que exigem login  
✅ **Refresh Automático** - Tokens renovados automaticamente  

## 🔑 Usar no Código

### Login
```tsx
import { useAuth } from '@/contexts/AuthContext'

const { login } = useAuth()
await login({ username: 'user', password: 'pass' })
```

### Verificar Usuário
```tsx
const { user, isAuthenticated } = useAuth()
if (isAuthenticated) {
  console.log(user.name, user.mail, user.roles)
}
```

### Proteger Página
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  )
}
```

### Verificar Admin
```tsx
<ProtectedRoute requiredRoles={['administrator']}>
  <AdminPanel />
</ProtectedRoute>
```

## 🐛 Problemas Comuns

### "Login failed"
→ Verifique CLIENT_ID e CLIENT_SECRET no `.env.local`  
→ Confirme que o consumer OAuth está ativo no Drupal

### "Failed to fetch user"
→ Verifique permissões em `/admin/people/permissions`  
→ Role "authenticated user" precisa de "Access GET on user resource"

### CORS Error
→ Adicione `http://localhost:3000` nas configurações CORS do Drupal

## 📖 Documentação Completa

Ver `AUTHENTICATION.md` para detalhes completos.
