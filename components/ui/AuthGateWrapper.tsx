"use client"

import { AuthGate } from "@/components/ui/AuthGate"
import type { ReactNode } from "react"

interface AuthGateWrapperProps {
  requiresAuth: boolean
  children: ReactNode
}

/**
 * Client component wrapper for AuthGate, usable from server components.
 */
export function AuthGateWrapper({ requiresAuth, children }: AuthGateWrapperProps) {
  return <AuthGate requiresAuth={requiresAuth}>{children}</AuthGate>
}
