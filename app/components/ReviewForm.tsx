"use client";
import { useState } from 'react';
import Image from 'next/image';
import  {useFarcasterUser} from '../hooks/useFarcasterUser';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

interface FarcasterUserData {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio?: string;
}

export default function ReviewForm({ 
  productId, 
  productName, 
  onReviewSubmitted, 
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user, loading: userLoading } = useFarcasterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const userData = user as FarcasterUserData | null;
      const reviewData = {
        productId,
        productName,
        rating,
        comment: comment.trim(),
        userFid: userData?.fid?.toString() || null,
        userName: userData?.display_name || userData?.username || 'Anonymous User',
        userProfileImage: userData?.pfp_url || null,
      };
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        onReviewSubmitted();
        // Reset form
        setRating(0);
        setComment('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit review');
      }
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoveredRating || rating);
      
      return (
        <button
          key={starNumber}
          type="button"
          onClick={() => setRating(starNumber)}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          className={`text-2xl transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
        >
          ★
        </button>
      );
    });
  };

  if (userLoading) {
    return
  }

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black">Write a Review</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
      </div>
      
      {/* User info */}
      {user && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={(user as FarcasterUserData).pfp_url || '/fallback.png'}
              alt={(user as FarcasterUserData).display_name || (user as FarcasterUserData).username || 'User'}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-medium text-black">
              {(user as FarcasterUserData).display_name || (user as FarcasterUserData).username}
            </p>
            <p className="text-sm text-gray-500">@{(user as FarcasterUserData).username}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating} out of 5 stars
            </p>
          )}
        </div>
        
        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        
        {/* Submit buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || rating === 0 || !comment.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}