'use client'
const TYPE_TABS = [
  { key: 'icTypes', label: 'IC Type' },
  { key: 'impact', label: 'Impact' },
  { key: 'sdg', label: 'SDG' },
]
export default function ScholarshipTable({ title, subtitle, data = [] }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className='text-lg text-gray-900 font-medium'>{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
          {/* Dropdown for filtering รายชื่อภาควิชา  */}
          {/* <label className="text-xs text-gray-500">Dropdown ภาควิชา (Department)</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-md text-gray-900"
          >
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select> */}
        </div>
      </div>
      
      <div className="overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {/* {TYPE_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-3 py-2 text-sm -mb-px border-b-2 ${activeType === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              {t.label} {counts[t.key] ? `(${counts[t.key]})` : ''}
            </button>
          ))} */}
        </div>
      </div>
    </div>
  )
}
