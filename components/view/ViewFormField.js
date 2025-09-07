'use client'

export default function ViewFormField({ label, value, type = 'text', isArray = false }) {
  const renderValue = () => {
    if (isArray && Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '-'
    }
    
    if (!value && value !== 0) return '-'
    
    if (type === 'date') {
      try {
        return new Date(value).toLocaleDateString('th-TH')
      } catch {
        return value
      }
    }
    
    if (type === 'number') {
      return new Intl.NumberFormat('th-TH').format(value)
    }
    
    if (typeof value === 'boolean') {
      return value ? 'ใช่' : 'ไม่ใช่'
    }
    
    return String(value)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
        {renderValue()}
      </div>
    </div>
  )
}
