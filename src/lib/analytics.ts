'use client'

import posthog from 'posthog-js'

/**
 * Track an event across PostHog + Meta Pixel.
 * Safe no-op when analytics keys aren't configured.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  // PostHog
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && posthog.__loaded) {
    posthog.capture(event, properties)
  }

  // Meta Pixel — map to standard event names when possible
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (fbq && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    const metaStandardMap: Record<string, string> = {
      waitlist_submit: 'Lead',
      signup_complete: 'CompleteRegistration',
      first_submission: 'SubmitApplication',
    }
    const metaEvent = metaStandardMap[event]
    if (metaEvent) {
      fbq('track', metaEvent, properties)
    } else {
      fbq('trackCustom', event, properties)
    }
  }
}

/**
 * Identify a user (for logged-in sessions). Call after signup/login.
 */
export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && posthog.__loaded) {
    posthog.identify(userId, traits)
  }
}

/**
 * Reset user session (on logout).
 */
export function resetAnalytics() {
  if (typeof window === 'undefined') return
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && posthog.__loaded) {
    posthog.reset()
  }
}
