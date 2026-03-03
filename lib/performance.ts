import { NextRequest, NextResponse } from 'next/server'
import { performance } from 'perf_hooks'

export function performanceMiddleware(request: NextRequest) {
  const start = performance.now()

  // Add request ID for tracking
  const requestId = Math.random().toString(36).substring(7)
  request.headers.set('x-request-id', requestId)

  // Log slow requests
  const response = NextResponse.next()

  response.headers.set('x-request-id', requestId)

  // Log response time in development
  // No logs in development to keep console clean

  return response
}

export class PerformanceMonitor {
  static async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const end = performance.now()
      // Performance measurement log removed
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`❌ ${name} failed after ${(end - start).toFixed(2)}ms:`, error)
      throw error
    }
  }
}
