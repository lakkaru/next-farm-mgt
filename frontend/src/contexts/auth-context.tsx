'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { toast } from 'sonner'

interface User {
  _id: string
  email?: string
  phone?: string
  profile: {
    firstName: string
    lastName: string
    phone?: string
    role: string
  }
  roles?: string[]
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAIL' | 'REGISTER_FAIL' | 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }

const getInitialState = (): AuthState => {
  // Always return a consistent initial state for server/client matching
  // The actual token will be loaded in useEffect
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading to prevent flashes
    error: null,
  }
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: { phone: string; password: string }) => Promise<void>
  register: (userData: Record<string, unknown>) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  clearError: () => void
  updateUser: (userData: Record<string, unknown>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, getInitialState())
  const router = useRouter()

  const loadUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile()
      dispatch({ type: 'LOAD_USER', payload: response.data.data })
    } catch (error) {
      console.error('Failed to load user:', error)
      dispatch({ type: 'AUTH_ERROR', payload: 'Failed to load user' })
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    }
  }, [])

  useEffect(() => {
    // Initialize auth state from localStorage after mount
    const token = localStorage.getItem('token')
    
    if (token && !state.user) {
      loadUser()
    } else if (!token) {
      // Mark loading as complete if no token
      dispatch({ type: 'CLEAR_ERROR' })
      // Don't dispatch error, just update isLoading
      dispatch({ type: 'LOGOUT' })
    }
  }, [loadUser, state.user, state.isAuthenticated])

  const login = async (credentials: { phone: string; password: string }) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.login(credentials)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token)
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data,
          token: response.data.data.token,
        },
      })
      
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      let message = 'Login failed'
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      }
      dispatch({ type: 'LOGIN_FAIL', payload: message })
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: Record<string, unknown>) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      const response = await authAPI.register(userData)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token)
      }
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.data.data,
          token: response.data.data.token,
        },
      })
      
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      let message = 'Registration failed'
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      }
      dispatch({ type: 'REGISTER_FAIL', payload: message })
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    dispatch({ type: 'LOGOUT' })
    router.push('/login')
    toast.success('Logged out successfully')
  }

  const updateUser = async (userData: Record<string, unknown>) => {
    try {
      const response = await authAPI.updateProfile(userData)
      dispatch({ type: 'LOAD_USER', payload: response.data.data })
      toast.success('Profile updated successfully!')
    } catch (error: unknown) {
      let message = 'Failed to update profile'
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      }
      toast.error(message)
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
