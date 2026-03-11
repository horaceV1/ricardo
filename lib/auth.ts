/**
 * Authentication utilities for Drupal backend integration
 */

export interface DrupalUser {
  uid: string
  uuid: string
  name: string
  mail: string
  roles: string[]
  created: string
  access: string
  login: string
  status: boolean
  field_first_name?: string
  field_last_name?: string
  field_phone?: string
  field_nif?: string
  field_address?: string
  field_city?: string
  field_postal_code?: string
  field_country?: string
  user_picture?: {
    url: string
    alt: string
  }
}

export interface AuthTokens {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  name: string
  mail: string
  pass: string
  field_first_name?: string
  field_last_name?: string
  field_phone?: string
  field_address?: string
  field_city?: string
  field_postal_code?: string
  field_country?: string
  field_nif?: string
}

/**
 * Login to Drupal using username and password (cookie-based authentication)
 */
/**
 * Login to Drupal using JWT authentication
 */
export async function login(credentials: LoginCredentials): Promise<AuthTokens & { user?: any }> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(error.error || 'Invalid credentials')
  }

  const data = await response.json()
  
  return {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.access_token,
    user: data.user,
  }
}

/**
 * Get current user data using JWT token
 */
export async function getCurrentUser(token: string): Promise<DrupalUser> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  const response = await fetch(`${baseUrl}/api/auth/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Not authenticated')
  }

  const data = await response.json()
  
  return {
    uid: data.uid.toString(),
    uuid: data.uuid,
    name: data.name,
    mail: data.mail,
    roles: data.roles,
    created: data.created,
    access: data.access,
    login: data.login,
    status: data.status,
    field_first_name: data.field_first_name,
    field_last_name: data.field_last_name,
    field_phone: data.field_phone,
    field_address: data.field_address,
    field_city: data.field_city,
    field_postal_code: data.field_postal_code,
    field_country: data.field_country,
    user_picture: data.user_picture || undefined,
  }
}

/**
 * Register a new user with JWT
 */
export async function register(userData: RegisterData): Promise<DrupalUser> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,
      mail: userData.mail,
      pass: userData.pass,
      field_first_name: userData.field_first_name,
      field_last_name: userData.field_last_name,
      field_phone: userData.field_phone,
      field_address: userData.field_address,
      field_city: userData.field_city,
      field_postal_code: userData.field_postal_code,
      field_country: userData.field_country,
      field_nif: userData.field_nif,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Registration failed' }))
    throw new Error(error.error || 'Registration failed')
  }

  const data = await response.json()
  
  // Return user data from registration
  return {
    uid: data.user.uid.toString(),
    uuid: data.user.uuid,
    name: data.user.name,
    mail: data.user.mail,
    roles: data.user.roles,
    created: new Date().toISOString(),
    access: new Date().toISOString(),
    login: new Date().toISOString(),
    status: true,
    field_first_name: data.user.field_first_name,
    field_last_name: data.user.field_last_name,
  }
}

/**
 * Refresh JWT token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  // For JWT, we can just return the same token since it's still valid
  // In a production app, you'd implement proper refresh token logic
  return {
    access_token: refreshToken,
    token_type: 'Bearer',
    expires_in: 86400,
    refresh_token: refreshToken,
  }
}

/**
 * Logout - with JWT this just clears the client-side token
 */
export async function logout(token: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: DrupalUser | null, role: string): boolean {
  if (!user) return false
  return user.roles.includes(role)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: DrupalUser | null, roles: string[]): boolean {
  if (!user) return false
  return roles.some(role => user.roles.includes(role))
}

/**
 * Check if user is administrator
 */
export function isAdmin(user: DrupalUser | null): boolean {
  return hasRole(user, 'administrator')
}
