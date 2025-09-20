export default function FormCheckbox({
  label,
  type = "checkbox",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  inline = false,
  options = [],
  col = null
}) {
  const isMulti = Array.isArray(value) && type === 'checkbox'

  function handleToggle(optionValue) {
    if (!onChange) return
    if (isMulti) {
      const arr = Array.isArray(value) ? [...value] : []
      const idx = arr.indexOf(optionValue)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(optionValue)
      onChange(arr)
    } else {
      onChange(optionValue)
    }
  }

  return (
    <div className="space-y-1 flex items-start flex-wrap">
      <div className={inline ? "w-1/3" : "w-full"}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <div className="flex-1">
        {col ? (
          <div className="grid grid-cols-2 gap-4">
            {options &&
              options.map((option) => (
                <label key={option.value} className="flex items-center gap-3 text-zinc-700">
                  <input
                    type={type}
                    value={option.value}
                    checked={isMulti ? (Array.isArray(value) && value.includes(option.value)) : value === option.value}
                    onChange={() => handleToggle(option.value)}
                    className={`
                      text-zinc-700
                      px-3 py-2 border border-gray-300 rounded-md
                      placeholder-gray-400 focus:outline-none focus:ring-2
                      focus:ring-blue-500 focus:border-blue-500
                      transition-colors duration-200
                      ${className}
                  `}
                  />
                  {option.label}
                </label>
              ))}
          </div>
        ) : (
            <div className="flex gap-4">
              {options &&
                options.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-zinc-700">
                    <input
                      type={type}
                      value={option.value}
                      checked={isMulti ? (Array.isArray(value) && value.includes(option.value)) : value === option.value}
                      onChange={() => handleToggle(option.value)}
                      className={`
                      text-zinc-700
                      px-3 py-2 border border-gray-300 rounded-md
                      placeholder-gray-400 focus:outline-none focus:ring-2
                      focus:ring-blue-500 focus:border-blue-500
                      transition-colors duration-200
                      ${className}
                  `}
                    />
                    {option.label}
                  </label>
                ))}
            </div>
        )
        }
      </div>
    </div>
  );
}
