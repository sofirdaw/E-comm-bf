import { redisClient } from './redis'

export class CacheService {
  private static instance: CacheService

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  // Cache keys patterns
  private static KEYS = {
    PRODUCTS: 'products:*',
    PRODUCT: 'product:',
    CATEGORIES: 'categories',
    BANNERS: 'banners',
    USER: 'user:',
    SESSION: 'session:',
    SETTINGS: 'settings',
    STATS: 'stats:',
    SEARCH: 'search:',
  }

  // TTL values in seconds
  private static TTL = {
    SHORT: 300,      // 5 minutes
    MEDIUM: 1800,   // 30 minutes
    LONG: 3600,     // 1 hour
    DAY: 86400,     // 24 hours
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(key)
      if (cached) {
        return JSON.parse(cached) as T
      }
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      await redisClient.set(key, serialized, ttl || CacheService.TTL.MEDIUM)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  public async invalidate(key: string): Promise<void> {
    try {
      await redisClient.del(key)
    } catch (error) {
      console.error('Cache invalidate error:', error)
    }
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    try {
      await redisClient.invalidatePattern(pattern)
    } catch (error) {
      console.error('Cache invalidate pattern error:', error)
    }
  }

  // Product caching
  public async getProducts(): Promise<any[] | null> {
    return this.get<any[]>(CacheService.KEYS.PRODUCTS.replace('*', 'all'))
  }

  public async setProducts(products: any[]): Promise<void> {
    await this.set(CacheService.KEYS.PRODUCTS.replace('*', 'all'), products, CacheService.TTL.MEDIUM)
  }

  public async getProduct(id: string): Promise<any | null> {
    return this.get<any>(CacheService.KEYS.PRODUCT + id)
  }

  public async setProduct(id: string, product: any): Promise<void> {
    await this.set(CacheService.KEYS.PRODUCT + id, product, CacheService.TTL.LONG)
  }

  public async invalidateProducts(): Promise<void> {
    await this.invalidatePattern(CacheService.KEYS.PRODUCTS)
  }

  // Category caching
  public async getCategories(): Promise<any[] | null> {
    return this.get<any[]>(CacheService.KEYS.CATEGORIES)
  }

  public async setCategories(categories: any[]): Promise<void> {
    await this.set(CacheService.KEYS.CATEGORIES, categories, CacheService.TTL.LONG)
  }

  public async invalidateCategories(): Promise<void> {
    await this.invalidate(CacheService.KEYS.CATEGORIES)
  }

  // Banner caching
  public async getBanners(): Promise<any[] | null> {
    return this.get<any[]>(CacheService.KEYS.BANNERS)
  }

  public async setBanners(banners: any[]): Promise<void> {
    await this.set(CacheService.KEYS.BANNERS, banners, CacheService.TTL.MEDIUM)
  }

  public async invalidateBanners(): Promise<void> {
    await this.invalidate(CacheService.KEYS.BANNERS)
  }

  // User caching
  public async getUser(id: string): Promise<any | null> {
    return this.get<any>(CacheService.KEYS.USER + id)
  }

  public async setUser(id: string, user: any): Promise<void> {
    await this.set(CacheService.KEYS.USER + id, user, CacheService.TTL.SHORT)
  }

  public async invalidateUser(id: string): Promise<void> {
    await this.invalidate(CacheService.KEYS.USER + id)
  }

  // Settings caching
  public async getSettings(): Promise<any | null> {
    return this.get<any>(CacheService.KEYS.SETTINGS)
  }

  public async setSettings(settings: any): Promise<void> {
    await this.set(CacheService.KEYS.SETTINGS, settings, CacheService.TTL.LONG)
  }

  public async invalidateSettings(): Promise<void> {
    await this.invalidate(CacheService.KEYS.SETTINGS)
  }

  // Search caching
  public async getSearchResults(query: string): Promise<any[] | null> {
    return this.get<any[]>(CacheService.KEYS.SEARCH + query)
  }

  public async setSearchResults(query: string, results: any[]): Promise<void> {
    await this.set(CacheService.KEYS.SEARCH + query, results, CacheService.TTL.SHORT)
  }

  // Stats caching
  public async getStats(type: string): Promise<any | null> {
    return this.get<any>(CacheService.KEYS.STATS + type)
  }

  public async setStats(type: string, stats: any): Promise<void> {
    await this.set(CacheService.KEYS.STATS + type, stats, CacheService.TTL.SHORT)
  }

  public async invalidateStats(): Promise<void> {
    await this.invalidatePattern(CacheService.KEYS.STATS)
  }

  // Clear all cache
  public async clearAll(): Promise<void> {
    await redisClient.flushAll()
  }
}

export const cacheService = CacheService.getInstance()
