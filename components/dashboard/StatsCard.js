'use client'

export default function StatsCard({ title, stats, bgColor = 'bg-white' }) {
  return (
    <div className={`p-6 border rounded-lg shadow-sm space-y-4 ${bgColor}`}>
      <h2 className='text-lg text-gray-900 font-medium'>{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100">
              <stat.icon className="size-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
