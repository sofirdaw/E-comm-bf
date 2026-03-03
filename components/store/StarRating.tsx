'use client'
// components/store/StarRating.tsx

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    maxStars?: number
    size?: 'sm' | 'md' | 'lg'
    interactive?: boolean
    onRate?: (rating: number) => void
    hoveredRating?: number
    onHover?: (rating: number) => void
    onHoverLeave?: () => void
}

const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
}

export function StarRating({
    rating,
    maxStars = 5,
    size = 'md',
    interactive = false,
    onRate,
    hoveredRating,
    onHover,
    onHoverLeave,
}: StarRatingProps) {
    const activeRating = hoveredRating ?? rating
    const starClass = sizeMap[size]

    return (
        <div className="flex items-center gap-0.5" onMouseLeave={onHoverLeave}>
            {Array.from({ length: maxStars }).map((_, i) => {
                const starValue = i + 1
                const filled = starValue <= Math.floor(activeRating)
                const halfFilled = !filled && starValue - 0.5 <= activeRating

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onRate?.(starValue)}
                        onMouseEnter={() => interactive && onHover?.(starValue)}
                        className={cn(
                            'transition-transform',
                            interactive && 'cursor-pointer hover:scale-125',
                            !interactive && 'cursor-default'
                        )}
                        aria-label={`${starValue} étoiles`}
                    >
                        <Star
                            className={cn(
                                starClass,
                                'transition-colors duration-150',
                                filled
                                    ? 'fill-[#e8aa1f] text-[#e8aa1f]'
                                    : halfFilled
                                        ? 'fill-[#e8aa1f]/50 text-[#e8aa1f]'
                                        : 'fill-transparent text-[#4a4a5a]'
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}

// Compact display-only rating badge (for product cards)
export function RatingBadge({ rating, count }: { rating: number; count: number }) {
    if (!count) return null
    return (
        <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#e8aa1f] text-[#e8aa1f]" />
            <span className="text-xs font-medium text-[#e8aa1f]">{rating.toFixed(1)}</span>
            <span className="text-xs text-[#6e6e80]">({count})</span>
        </div>
    )
}
