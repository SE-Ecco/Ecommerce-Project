// WHAT: Product reviews list + add review form
// IMPORTS: reviewService, useAuth, @mui/material
// USED BY: ProductDetailPage.tsx

import { useState, useEffect } from 'react'
import { Box, Typography, Rating, TextField, Divider } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import * as reviewService from '../../services/reviewService'
import Button from '../common/Button'
import Spinner from '../common/Spinner'

interface Props {
  productId: number
}

const ProductReviews = ({ productId }: Props) => {
  const { isAuthenticated, isCustomer } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // load reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviews(productId)
        setReviews(data)
      } catch {
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [productId])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await reviewService.createReview({ productId, rating, comment })
      const data = await reviewService.getReviews(productId)
      setReviews(data)
      setComment('')
      setRating(5)
    } catch {
      setError('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reviews ({reviews.length})
      </Typography>

      {/* add review form — customers only */}
      {isAuthenticated && isCustomer && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Leave a Review</Typography>
          <Rating
            value={rating}
            onChange={(_, val) => setRating(val || 5)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ mt: 1 }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>
      )}

      <Divider />

      {/* reviews list */}
      {reviews.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No reviews yet
        </Typography>
      ) : (
        reviews.map((review: any) => (
          <Box key={review.id} sx={{ py: 2 }}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2">{review.comment}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))
      )}

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default ProductReviews