export default function DisplayField({ label, value, after }) {
  const text = value === null || value === undefined || value === '' ? '-' : String(value)
  return (
    <div className="space-y-1">
      {label && (
        <div className="text-sm text-gray-600">{label}</div>
      )}
      <div className="text-gray-900">
        {text}
        {after ? <span className="ml-1 text-gray-500">{after}</span> : null}
      </div>
    </div>
  )
}

