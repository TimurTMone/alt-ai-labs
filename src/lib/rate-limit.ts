import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (per-instance — for Vercel use @vercel/kv in production)
const requests = new Map<string, { count: number; resetAt: number }>()

interface RateLimitConfig {
  maxRequests: number    // max requests per window
  windowMs: number       // window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; remaining: number } {
  const ip = getClientIp(request)
  const key = `${ip}:${request.nextUrl.pathname}`
  const now = Date.now()

  const entry = requests.get(key)

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + config.windowMs })
    return { success: true, remaining: config.maxRequests - 1 }
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: config.maxRequests - entry.count }
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': '60' } }
  )
}

// Vote endpoints get stricter limits
export const VOTE_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
}
