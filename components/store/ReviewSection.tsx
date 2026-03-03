'use client'
// components/store/ReviewSection.tsx

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { StarRating } from './StarRating'
import { formatDate } from '@/lib/utils'

interface Review {
    id: string
    rating: number
    title: string | null
    body: string
    createdAt: string
    user: { name: string | null; image: string | null }
}

export function ReviewSection({ productId }: { productId: string }) {
    const { data: session } = useSession()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    // Form state
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    useEffect(() => {
        fetch(`/api/products/${productId}/review`)
            .then(r => r.json())
            .then(data => { setReviews(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [productId, success])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!rating) { setError('Veuillez sélectionner une note'); return }
        if (!body.trim()) { setError('Veuillez écrire un commentaire'); return }

        setSubmitting(true)
        setError('')

        try {
            const res = await fetch(`/api/products/${productId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, title, body }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erreur')
            }

            setSuccess(true)
            setRating(0)
            setTitle('')
            setBody('')
            // Reset success after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: reviews.length
            ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
            : 0,
    }))

    return (
        <section className="mt-12 border-t border-white/5 pt-10">
            <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#d4920c]" />
                Avis clients
                {reviews.length > 0 && (
                    <span className="text-base font-normal text-[#9898a8] ml-1">({reviews.length})</span>
                )}
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Summary column */}
                <div className="lg:col-span-1">
                    {reviews.length > 0 ? (
                        <div className="card p-6 text-center sticky top-24">
                            <div className="text-5xl font-bold text-white mb-2">{avgRating.toFixed(1)}</div>
                            <StarRating rating={avgRating} size="lg" />
                            <p className="text-sm text-[#6e6e80] mt-2">{reviews.length} avis</p>

                            {/* Distribution bars */}
                            <div className="mt-6 space-y-2">
                                {ratingDistribution.map(({ star, count, pct }) => (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="text-[#9898a8] w-4">{star}</span>
                                        <Star className="w-3 h-3 fill-[#e8aa1f] text-[#e8aa1f]" />
                                        <div className="flex-1 bg-[#232330] rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-[#e8aa1f] rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-[#6e6e80] w-6">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="card p-6 text-center">
                            <Star className="w-12 h-12 text-[#4a4a5a] mx-auto mb-3" />
                            <p className="text-[#9898a8]">Soyez le premier à donner votre avis !</p>
                        </div>
                    )}

                    {/* Write review form */}
                    {session ? (
                        <div className="card p-6 mt-4">
                            <h3 className="font-medium text-[#e8e8ec] mb-4">Laisser un avis</h3>

                            {success ? (
                                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg p-3">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm">Merci pour votre avis !</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-[#6e6e80] mb-2 block">Votre note *</label>
                                        <StarRating
                                            rating={rating}
                                            size="lg"
                                            interactive
                                            onRate={setRating}
                                            hoveredRating={hoveredRating}
                                            onHover={setHoveredRating}
                                            onHoverLeave={() => setHoveredRating(0)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-[#6e6e80] mb-1 block">Titre (optionnel)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="Résumez votre expérience"
                                            className="input w-full text-sm"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-[#6e6e80] mb-1 block">Commentaire *</label>
                                        <textarea
                                            value={body}
                                            onChange={e => setBody(e.target.value)}
                                            placeholder="Partagez votre expérience avec ce produit..."
                                            rows={4}
                                            className="input w-full text-sm resize-none"
                                            maxLength={1000}
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-xs text-red-400 bg-red-400/10 rounded px-3 py-2">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full justify-center disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <span className="animate-pulse">Envoi...</span>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Publier mon avis
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="card p-6 mt-4 text-center">
                            <p className="text-sm text-[#6e6e80] mb-3">Connectez-vous pour laisser un avis</p>
                            <Link href="/auth/login" className="btn-primary">Se connecter</Link>
                        </div>
                    )}
                </div>

                {/* Reviews list */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="card p-5 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-[#2a2a30]" />
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-24 bg-[#2a2a30] rounded" />
                                        <div className="h-2.5 w-16 bg-[#2a2a30] rounded" />
                                    </div>
                                </div>
                                <div className="h-2.5 bg-[#2a2a30] rounded w-full mb-2" />
                                <div className="h-2.5 bg-[#2a2a30] rounded w-3/4" />
                            </div>
                        ))
                    ) : reviews.length === 0 ? (
                        <div className="card p-10 text-center">
                            <MessageSquare className="w-12 h-12 text-[#4a4a5a] mx-auto mb-3" />
                            <p className="text-[#9898a8]">Aucun avis pour l'instant. Soyez le premier !</p>
                        </div>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="card p-5 hover:border-[rgba(212,146,12,0.15)] transition-colors">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#232330] flex items-center justify-center text-[#d4920c] font-bold text-sm flex-shrink-0">
                                            {review.user.image ? (
                                                <Image src={review.user.image} alt={review.user.name || ''} width={36} height={36} className="w-full h-full object-cover" />
                                            ) : (
                                                review.user.name?.[0]?.toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#e8e8ec]">{review.user.name || 'Anonyme'}</p>
                                            <p className="text-xs text-[#6e6e80]">{formatDate(new Date(review.createdAt))}</p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>

                                {review.title && (
                                    <p className="font-medium text-[#e8e8ec] text-sm mb-1">{review.title}</p>
                                )}
                                <p className="text-sm text-[#9898a8] leading-relaxed">{review.body}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
