'use client';

import React from 'react';

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity: string;
    budget: string;
    deadline: number; // days remaining
    buyerCountry: string;
    buyerName: string;
    status: 'Open' | 'Receiving Quotes' | 'Closed' | 'Awarded';
    quotationCount: number;
  };
}

const statusColors = {
  'Open': { bg: 'bg-blue-600 bg-opacity-20', text: 'text-blue-400', icon: '🔵' },
  'Receiving Quotes': { bg: 'bg-yellow-600 bg-opacity-20', text: 'text-yellow-400', icon: '📊' },
  'Closed': { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-400', icon: '🔒' },
  'Awarded': { bg: 'bg-green-600 bg-opacity-20', text: 'text-green-400', icon: '✓' },
};

export default function RequestCard({ request }: RequestCardProps) {
  const colors = statusColors[request.status];
  const urgency = request.deadline <= 7 ? 'high' : request.deadline <= 15 ? 'medium' : 'low';
  const urgencyColor = urgency === 'high' ? 'text-red-400' : urgency === 'medium' ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#d4a843] transition-all duration-200 cursor-pointer group">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-bold text-lg group-hover:text-[#d4a843] transition-colors">
                {request.title}
              </h3>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{request.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 ${colors.bg} ${colors.text}`}>
            {request.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Category</p>
            <p className="text-white font-semibold">{request.category}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Quantity</p>
            <p className="text-white font-semibold">{request.quantity}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Budget</p>
            <p className="text-[#d4a843] font-bold">{request.budget}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Quotations</p>
            <p className="text-white font-semibold">{request.quotationCount} received</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#242830]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🌍</span>
              <span className="text-gray-400 text-sm">{request.buyerCountry}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">{request.buyerName}</span>
            </div>
            <div className={`flex items-center gap-1 ${urgencyColor}`}>
              <span>⏱</span>
              <span className="font-semibold text-sm">
                {request.deadline} {request.deadline === 1 ? 'day' : 'days'} left
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded-lg hover:bg-opacity-30 transition-colors font-semibold text-sm whitespace-nowrap">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
