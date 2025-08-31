export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = "",
  readOnly = false,
  disabled = false,
}) {
  return (
    <div className="space-y-1 flex items-start">
      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700">
          <span dangerouslySetInnerHTML={{ __html: label }} />
          {/* Show asterisk if required */}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <div className="flex-1">        
        <textarea
            value={value ?? ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            readOnly={readOnly}
            disabled={disabled}
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
    </div>
  );
}
