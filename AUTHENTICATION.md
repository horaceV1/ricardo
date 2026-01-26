# Sistema de Autenticação - Clínica do Empresário

Este documento descreve o sistema de autenticação integrado com o backend Drupal.

## 📋 Visão Geral

O sistema de autenticação utiliza OAuth 2.0 para conectar o frontend Next.js com o backend Drupal, permitindo:

- ✅ Login e registro de usuários
- ✅ Gerenciamento de sessões com tokens JWT
- ✅ Controle de acesso baseado em permissões do Drupal
- ✅ Páginas protegidas que requerem autenticação
- ✅ Dashboard de conta do usuário
- ✅ Integração com roles e permissões do Drupal

## 🔧 Configuração do Backend Drupal

### 1. Instalar Módulos Necessários

Certifique-se de que os seguintes módulos estão instalados e habilitados no Drupal:

```bash
composer require drupal/simple_oauth
drush en simple_oauth -y
```

### 2. Configurar Simple OAuth

1. Acesse `/admin/config/people/simple_oauth`
2. Configure as seguintes opções:
   - **Token expiration time**: 3600 (1 hora)
   - **Refresh token expiration time**: 86400 (1 dia)
   - **Public Key Path**: (deixe em branco se usar o default)
   - **Private Key Path**: (deixe em branco se usar o default)

### 3. Criar OAuth Consumer

1. Acesse `/admin/config/services/consumer/add`
2. Preencha os campos:
   - **Label**: "Next.js Frontend"
   - **User**: Selecione um usuário admin
   - **Client ID**: Gere um UUID (ex: `nextjs-frontend`)
   - **Secret**: Gere uma string segura
   - **Redirect URI**: `http://localhost:3000/api/auth/callback` (para desenvolvimento)
3. Marque as opções:
   - ✅ **Use Password Grant**
   - ✅ **Use Refresh Token Grant**
4. Salve o consumer

### 4. Configurar Permissões

1. Acesse `/admin/people/permissions`
2. Para o role "authenticated user":
   - ✅ **Access GET on user resource**
   - ✅ **Access POST on user resource** (para registro)
3. Configure permissões adicionais conforme necessário

### 5. Habilitar CORS (Opcional para desenvolvimento local)

Se estiver testando localmente, adicione ao `services.yml`:

```yaml
cors.config:
  enabled: true
  allowedOrigins:
    - 'http://localhost:3000'
    - 'https://your-production-domain.com'
  allowedMethods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
  allowedHeaders:
    - '*'
  maxAge: 3600
```

## 🔑 Configuração do Frontend

### 1. Variáveis de Ambiente

Atualize o arquivo `.env.local`:

```env
# URL do backend Drupal
NEXT_PUBLIC_DRUPAL_BASE_URL=https://darkcyan-stork-408379.hostingersite.com

# Credenciais OAuth (do consumer criado no passo 3)
NEXT_PUBLIC_DRUPAL_CLIENT_ID=nextjs-frontend
NEXT_PUBLIC_DRUPAL_CLIENT_SECRET=sua-secret-aqui
DRUPAL_CLIENT_ID=nextjs-frontend
DRUPAL_CLIENT_SECRET=sua-secret-aqui
```

### 2. Estrutura de Arquivos

```
ricardo/
├── app/
│   ├── entrar/page.tsx          # Página de login
│   ├── cadastrar/page.tsx       # Página de registro
│   └── conta/page.tsx           # Dashboard da conta
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Componente para rotas protegidas
│   └── navigation/
│       └── HeaderNav.tsx        # Navegação com menu de usuário
├── contexts/
│   └── AuthContext.tsx          # Context API para autenticação
└── lib/
    └── auth.ts                  # Funções de autenticação
```

## 📱 Uso

### Login

```typescript
import { useAuth } from '@/contexts/AuthContext'

function LoginComponent() {
  const { login } = useAuth()
  
  const handleLogin = async () => {
    await login({
      username: 'usuario',
      password: 'senha'
    })
  }
}
```

### Verificar Autenticação

```typescript
import { useAuth } from '@/contexts/AuthContext'

function ProtectedComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Por favor, faça login</div>
  }
  
  return <div>Olá, {user.name}!</div>
}
```

### Proteger Rotas

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  )
}
```

### Verificar Permissões

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['administrator']}>
      <div>Painel administrativo</div>
    </ProtectedRoute>
  )
}
```

### Hook de Permissões

```typescript
import { usePermission } from '@/components/auth/ProtectedRoute'

function AdminButton() {
  const { hasPermission } = usePermission(['administrator'])
  
  if (!hasPermission) return null
  
  return <button>Ação Admin</button>
}
```

## 🎯 Funcionalidades Disponíveis

### Páginas

- `/entrar` - Página de login
- `/cadastrar` - Página de registro de novos usuários
- `/conta` - Dashboard da conta do usuário (protegida)

### Componentes

- **HeaderNav** - Navegação com menu dropdown para usuários autenticados
- **ProtectedRoute** - Wrapper para proteger rotas
- **AuthContext** - Context para gerenciar estado de autenticação

### Funções

- `login()` - Fazer login com username/password
- `logout()` - Fazer logout e revogar token
- `register()` - Registrar novo usuário
- `getCurrentUser()` - Obter dados do usuário atual
- `refreshAccessToken()` - Renovar token expirado
- `hasRole()` - Verificar se usuário tem role específica
- `isAdmin()` - Verificar se usuário é administrador

## 🔒 Segurança

### Armazenamento de Tokens

Os tokens são armazenados no `localStorage` do navegador:
- `drupal_auth_tokens` - Tokens de acesso e refresh
- `drupal_token_expiry` - Timestamp de expiração

### Renovação Automática

O sistema automaticamente renova tokens expirados usando refresh tokens.

### Proteção de Rotas

Rotas protegidas redirecionam automaticamente para `/entrar` se o usuário não estiver autenticado.

## 🐛 Troubleshooting

### Erro: "Login failed" ou "Invalid credentials"

- ✅ Verifique se o usuário existe no Drupal
- ✅ Confirme que a senha está correta
- ✅ Verifique as credenciais OAuth no `.env.local`
- ✅ Certifique-se de que o consumer OAuth está configurado corretamente

### Erro: "Failed to fetch user data"

- ✅ Verifique se o token está válido
- ✅ Confirme permissões do usuário no Drupal
- ✅ Verifique se JSON:API está habilitado

### Erro: "CORS policy"

- ✅ Configure CORS no Drupal (ver seção 5 da configuração do backend)
- ✅ Verifique se a origem está na whitelist

### Token expira muito rápido

- ✅ Ajuste `expires_in` nas configurações do Simple OAuth
- ✅ Use refresh tokens para renovar automaticamente

## 📚 Referências

- [Simple OAuth Documentation](https://www.drupal.org/docs/contributed-modules/simple-oauth)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)

## 🤝 Suporte

Para problemas ou dúvidas sobre o sistema de autenticação, consulte:
- Logs do Drupal: `/admin/reports/dblog`
- Console do navegador (Network tab)
- Documentação do Simple OAuth
