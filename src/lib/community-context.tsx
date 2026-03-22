'use client'

import { createContext, useContext } from 'react'
import type { Community } from '@/types/database'

const CommunityContext = createContext<Community | null>(null)

export function CommunityProvider({ community, children }: { community: Community; children: React.ReactNode }) {
  return <CommunityContext.Provider value={community}>{children}</CommunityContext.Provider>
}

export function useCommunity() {
  return useContext(CommunityContext)
}

export function useCommunityRequired() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunityRequired must be used within CommunityProvider')
  return ctx
}
