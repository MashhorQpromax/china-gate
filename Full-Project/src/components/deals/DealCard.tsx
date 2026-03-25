import { Deal, DealStage } from '@/types';

interface DealCardProps {
  deal: Deal;
  stageLabel: string;
  stageColor: string;
  progress: number;
  buyerName: string;
  supplierName: string;
}

export default function DealCard({
  deal,
  stageLabel,
  stageColor,
  progress,
  buyerName,
  supplierName,
}: DealCardProps) {
  const daysAgo = Math.floor((Date.now() - deal.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-all hover:shadow-lg hover:shadow-red-900/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{deal.referenceNumber}</h3>
          <p className="text-gray-400 text-sm mt-1">{buyerName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColor}`}>
          {stageLabel}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Amount</p>
          <p className="text-white font-semibold">${(deal.totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Supplier</p>
          <p className="text-gray-300 text-sm">{supplierName}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-xs">Progress</p>
          <p className="text-gray-400 text-xs">{Math.round(progress)}%</p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#c41e3a] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-700">
        <span>{daysAgo} days ago</span>
        <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300 font-semibold">
          View →
        </a>
      </div>
    </div>
  );
}
