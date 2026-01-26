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
}

/**
 * Login to Drupal using username and password (cookie-based authentication)
 */
export async function login(credentials: LoginCredentials): Promise<AuthTokens & { user?: any }> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  
  // First, get CSRF token
  const csrfResponse = await fetch(`${baseUrl}/session/token`, {
    credentials: 'include',
  })
  const csrfToken = await csrfResponse.text()

  // Login via Drupal's user login endpoint
  const response = await fetch(`${baseUrl}/user/login?_format=json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify({
      name: credentials.username,
      pass: credentials.password,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Invalid credentials')
  }

  const userData = await response.json()
  
  // Return session data with user info
  return {
    access_token: userData.csrf_token || csrfToken,
    token_type: 'Bearer',
    expires_in: 86400, // 24 hours
    refresh_token: csrfToken,
    user: userData.current_user, // Include user data from login response
  }
}

/**
 * Get current user data using CSRF token (cookie-based auth)
 * Note: This is a workaround since Drupal doesn't have a simple "current user" endpoint
 */
export async function getCurrentUser(csrfToken: string): Promise<DrupalUser> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  // First check if user is authenticated
  const statusResponse = await fetch(`${baseUrl}/user/login_status?_format=json`, {
    credentials: 'include',
  })

  const loginStatus = await statusResponse.text()
  
  if (loginStatus !== '1') {
    throw new Error('Not authenticated')
  }

  // For simplicity, return a basic user object
  // In a real app, you'd fetch from JSON:API or create a custom endpoint
  // For now, we rely on the user data from login response
  return {
    uid: '0',
    uuid: '',
    name: 'User',
    mail: '',
    roles: ['authenticated'],
    created: '',
    access: '',
    login: '',
    status: true,
  }
}

/**
 * Register a new user
 */
export async function register(userData: RegisterData): Promise<DrupalUser> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  const response = await fetch(`${baseUrl}/user/register?_format=json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: { value: userData.name },
      mail: { value: userData.mail },
      pass: { value: userData.pass },
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }))
    throw new Error(error.message || 'Registration failed')
  }

  const data = await response.json()

  // After registration, return a basic user object
  // The user will need to login to get full details
  return {
    uid: data.uid?.[0]?.value || '',
    uuid: data.uuid?.[0]?.value || '',
    name: data.name?.[0]?.value || userData.name,
    mail: data.mail?.[0]?.value || userData.mail,
    roles: ['authenticated'],
    created: data.created?.[0]?.value || new Date().toISOString(),
    access: '',
    login: '',
    status: true,
    field_first_name: userData.field_first_name,
    field_last_name: userData.field_last_name,
  }
}

/**
 * Refresh CSRF token (cookie-based auth)
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  
  // Get new CSRF token
  const csrfResponse = await fetch(`${baseUrl}/session/token`, {
    credentials: 'include',
  })
  
  if (!csrfResponse.ok) {
    throw new Error('Failed to refresh token')
  }

  const csrfToken = await csrfResponse.text()

  return {
    access_token: csrfToken,
    token_type: 'Bearer',
    expires_in: 86400,
    refresh_token: csrfToken,
  }
}

/**
 * Logout (destroy Drupal session)
 */
export async function logout(csrfToken: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  await fetch(`${baseUrl}/user/logout?_format=json`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
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
