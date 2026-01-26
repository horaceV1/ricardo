"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
  refreshAccessToken,
  type DrupalUser,
  type AuthTokens,
  type LoginCredentials,
} from '@/lib/auth'

interface AuthContextType {
  user: DrupalUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'drupal_auth_tokens'
const TOKEN_EXPIRY_KEY = 'drupal_token_expiry'
const USER_STORAGE_KEY = 'drupal_user_data'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DrupalUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Store tokens in localStorage
  const storeTokens = useCallback((tokens: AuthTokens) => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
    const expiryTime = Date.now() + (tokens.expires_in * 1000)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  }, [])

  // Store user data in localStorage
  const storeUser = useCallback((userData: DrupalUser) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }, [])

  // Get user data from localStorage
  const getStoredUser = useCallback((): DrupalUser | null => {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem(USER_STORAGE_KEY)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }, [])

  // Get tokens from localStorage
  const getTokens = useCallback((): AuthTokens | null => {
    if (typeof window === 'undefined') return null
    
    const tokensStr = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!tokensStr) return null
    
    try {
      return JSON.parse(tokensStr)
    } catch {
      return null
    }
  }, [])

  // Clear tokens from localStorage
  const clearTokens = useCallback(() => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }, [])

  // Check if token is expired
  const isTokenExpired = useCallback((): boolean => {
    if (typeof window === 'undefined') return true
    
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiryStr) return true
    
    const expiry = parseInt(expiryStr)
    return Date.now() >= expiry
  }, [])

  // Refresh token if needed
  const refreshTokenIfNeeded = useCallback(async (): Promise<string | null> => {
    const tokens = getTokens()
    if (!tokens) return null

    // If token is not expired, return it
    if (!isTokenExpired()) {
      return tokens.access_token
    }

    // If we have a refresh token, use it
    if (tokens.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(tokens.refresh_token)
        storeTokens(newTokens)
        return newTokens.access_token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        clearTokens()
        setUser(null)
        return null
      }
    }

    // Token expired and no refresh token
    clearTokens()
    setUser(null)
    return null
  }, [getTokens, isTokenExpired, storeTokens, clearTokens])

  // Fetch and set user data
  const fetchUser = useCallback(async () => {
    const accessToken = await refreshTokenIfNeeded()
    if (!accessToken) {
      setIsLoading(false)
      return
    }

    // Try to get user from localStorage first
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      setIsLoading(false)
      return
    }

    // If no stored user, try to fetch (though this may fail with current implementation)
    try {
      const userData = await getCurrentUser(accessToken)
      setUser(userData)
      storeUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [refreshTokenIfNeeded, clearTokens, getStoredUser, storeUser])

  // Initialize auth state on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const tokens = await loginApi(credentials)
      storeTokens(tokens)
      
      // Try to get user from login response, otherwise fetch it
      if ((tokens as any).user) {
        const loginUser = (tokens as any).user
        // Convert login response to DrupalUser format
        const userData: DrupalUser = {
          uid: loginUser.uid,
          uuid: '', // Will be fetched if needed
          name: loginUser.name,
          mail: '', // Will be fetched if needed
          roles: loginUser.roles || ['authenticated'],
          created: '',
          access: '',
          login: '',
          status: true,
        }
        setUser(userData)
        storeUser(userData) // Store user data in localStorage
      } else {
        const userData = await getCurrentUser(tokens.access_token)
        setUser(userData)
        storeUser(userData) // Store user data in localStorage
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [storeTokens])

  // Logout function
  const logout = useCallback(async () => {
    const tokens = getTokens()
    if (tokens) {
      try {
        await logoutApi(tokens.access_token)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    clearTokens()
    setUser(null)
  }, [getTokens, clearTokens])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
