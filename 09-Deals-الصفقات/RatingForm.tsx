'use client';

import React, { useState } from 'react';

interface RatingFormProps {
  dealId: string;
}

interface Rating {
  quality: number;
  delivery: number;
  communication: number;
  price: number;
  review: string;
}

export default function RatingForm({ dealId }: RatingFormProps) {
  const [rating, setRating] = useState<Rating>({
    quality: 0,
    delivery: 0,
    communication: 0,
    price: 0,
    review: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (category: keyof Omit<Rating, 'review'>, value: number) => {
    setRating({
      ...rating,
      [category]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the rating to your backend
    console.log('Rating submitted:', rating);
  };

  const overallRating = (rating.quality + rating.delivery + rating.communication + rating.price) / 4;

  const StarRating = ({ value, onRate, label }: { value: number; onRate: (val: number) => void; label: string }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-semibold mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`text-2xl transition-colors ${
              star <= value ? 'text-[#d4a843]' : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-green-400 font-semibold text-lg mb-2">✓ Thank you for your feedback!</p>
        <p className="text-gray-400">Your rating has been recorded and will help improve our service.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StarRating
        value={rating.quality}
        onRate={(val) => handleStarClick('quality', val)}
        label="Product Quality"
      />
      <StarRating
        value={rating.delivery}
        onRate={(val) => handleStarClick('delivery', val)}
        label="Delivery Performance"
      />
      <StarRating
        value={rating.communication}
        onRate={(val) => handleStarClick('communication', val)}
        label="Communication"
      />
      <StarRating
        value={rating.price}
        onRate={(val) => handleStarClick('price', val)}
        label="Price Value"
      />

      {overallRating > 0 && (
        <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Overall Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#d4a843]">{overallRating.toFixed(1)}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${star <= overallRating ? 'text-[#d4a843]' : 'text-gray-600'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-400 text-sm">(out of 5)</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Review (Optional)</label>
        <textarea
          value={rating.review}
          onChange={(e) => setRating({ ...rating, review: e.target.value })}
          placeholder="Share your experience with this deal..."
          className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={overallRating === 0}
        className="w-full px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        Submit Rating
      </button>
    </form>
  );
}
