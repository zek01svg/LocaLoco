import { useState, useCallback, useEffect } from 'react';
import { Review } from '../types/business';

interface SubmitReviewData {
  userEmail: string;
  businessUen: string;
  title?: string;
  body: string;
  rating: number;
}

interface BackendReview {
  id: number;
  userEmail: string;
  businessUen: string;
  rating: number;
  body: string;
  likeCount: number;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

// Transform backend review to frontend Review type
const transformBackendReview = (backendReview: BackendReview, businessId: string): Review => {
  // Extract username from email (before @)
  const userName = backendReview.userEmail.split('@')[0];

  return {
    id: backendReview.id.toString(),
    businessId: businessId,
    userName: userName,
    userAvatar: undefined,
    rating: backendReview.rating,
    comment: backendReview.body,
    date: backendReview.createdAt,
  };
};

export const useReviews = (businessId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(async (reviewData: SubmitReviewData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Submit review error:', error);
      setError(error.message || 'Failed to submit review');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const getBusinessReviews = useCallback(async (businessUen: string): Promise<Review[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews?uen=${businessUen}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');

      const backendReviews: BackendReview[] = await response.json();
      return backendReviews.map(review => transformBackendReview(review, businessUen));
    } catch (error: any) {
      console.error('Fetch reviews error:', error);
      setError(error.message || 'Failed to fetch reviews');
      throw error;
    }
  }, []);

  // Fetch reviews for specific business on mount
  useEffect(() => {
    if (businessId) {
      setIsLoading(true);
      getBusinessReviews(businessId)
        .then(fetchedReviews => {
          setReviews(fetchedReviews);
          setError(null);
        })
        .catch(err => {
          console.error('Error loading reviews:', err);
          setError(err.message || 'Failed to load reviews');
          setReviews([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [businessId, getBusinessReviews]);

  return {
    reviews,
    isLoading,
    submitReview,
    getBusinessReviews,
    isSubmitting,
    error,
  };
};
