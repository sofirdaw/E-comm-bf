import Redis from 'ioredis'

class RedisClient {
  private static instance: RedisClient
  private client: Redis
  private isConnected: boolean = false

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    })

    this.client.on('connect', () => {
      // Connection log removed
      this.isConnected = true
    })

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error)
      this.isConnected = false
    })

    this.client.on('close', () => {
      // Disconnection log removed
      this.isConnected = false
    })
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient()
    }
    return RedisClient.instance
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect()
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key)
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value)
      } else {
        await this.client.set(key, value)
      }
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Redis del error:', error)
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch (error) {
      console.error('Redis invalidate pattern error:', error)
    }
  }

  public async flushAll(): Promise<void> {
    try {
      await this.client.flushall()
    } catch (error) {
      console.error('Redis flush all error:', error)
    }
  }

  public isRedisConnected(): boolean {
    return this.isConnected
  }
}

export const redisClient = RedisClient.getInstance()
