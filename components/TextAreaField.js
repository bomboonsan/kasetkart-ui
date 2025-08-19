export default function TextAreaField({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 3,
  required = false,
  className = '' 
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
              className={`
            text-zinc-700
          block w-full px-3 py-2 border border-gray-300 rounded-md
          placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200 resize-vertical
          ${className}
        `}
      />
    </div>
  )
}
