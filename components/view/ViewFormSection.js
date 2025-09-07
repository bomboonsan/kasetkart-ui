'use client'

export default function ViewFormSection({ title, children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}
