export default function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-2xl font-medium text-gray-900 mb-6">{title}</h2>
      {children}
    </div>
  )
}
