export default function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  className = '' 
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
              className={`
            text-zinc-700
          block w-full px-3 py-2 border border-gray-300 rounded-md
          placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${className}
        `}
      />
    </div>
  )
}
