export default function FormRadio({
  label,
  type = "radio",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  inline = false,
  options = [],
}) {
  return (
    <div className="space-y-1 flex items-center flex-wrap">
      <div className={inline ? "w-1/3" : "w-full"}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <div className="flex-1">
        <div className="flex gap-3 items-center">
          {options &&
            options.map((option) => (
              <label key={option.value} className="flex items-center gap-3 text-zinc-700">
                <input
                  disabled={disabled}
                  type={type}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange && onChange(e.target.value)}
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
      </div>
    </div>
  );
}
