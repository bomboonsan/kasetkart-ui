import Link from 'next/link'

export default function ResearchTopicRow({ research, index }) {
  const handleEdit = () => {
    console.log('Edit research:', research.id)
  }

  const formatBudget = (amount) => {
    if (amount === 0) return '0'
    return amount.toLocaleString()
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Row Number */}
        <div className="col-span-1">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium
                ${research.color === "green" ? "bg-[#D1FAE5]" : "bg-blue-500"}
              `}
            >
              {index + 1}
            </div>
          </div>
        </div>

        {/* Research Number */}
        <div className="col-span-1">
          <span className="text-sm font-medium text-gray-900">
            {research.number}
          </span>
        </div>

        {/* Title */}
        <div className="col-span-3">
          <Link
            href={`/dashboard/research/${research.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            {research.title}
          </Link>
        </div>

        {/* Additional Info */}
        <div className="col-span-2">
          <span className="text-sm text-gray-600">{research.number}</span>
        </div>

        {/* Budget */}
        <div className="col-span-2">
          <span className="text-sm font-medium text-gray-900">
            {formatBudget(research.budget)}
          </span>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {research.status}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <button
            // onClick={handleEdit}
            className="text-sm text-red-600 hover:text-red-800 hover:underline"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
