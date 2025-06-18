'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    buyer: {
      id: string;
      name: string;
      profileImageUrl?: string;
    };
    project: {
      id: string;
      title: string;
    };
  };
  detailed?: boolean;
}

export function ReviewCard({ review, detailed = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`border rounded-lg p-4 ${detailed ? 'space-y-3' : 'space-y-2'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={review.buyer.profileImageUrl} />
            <AvatarFallback>
              {review.buyer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link 
              href={`/profile/${review.buyer.id}`}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              {review.buyer.name}
            </Link>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {renderStars(review.rating)}
      </div>

      {detailed && (
        <div className="ml-11">
          <Link 
            href={`/projects/${review.project.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Project: {review.project.title}
          </Link>
        </div>
      )}

      {review.comment && (
        <div className={`${detailed ? 'ml-11' : 'ml-0'} text-gray-700`}>
          <p className="text-sm">{review.comment}</p>
        </div>
      )}

      {!detailed && (
        <div className="text-xs text-gray-500">
          Project: {review.project.title}
        </div>
      )}
    </div>
  );
}
