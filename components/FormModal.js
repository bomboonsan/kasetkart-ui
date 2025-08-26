import Button from "./Button";
export default function FormModal({ 
  label, 
  btnText,
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  className = '',
  mini = false,
  after = null
}) {
  return (
    <div className="space-y-1 flex items-center">
      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <div className="flex-1 space-x-3">
        <button
          type="button"
          onClick={() => onChange && onChange(value)}
          className={`
            font-medium py-2 px-4 rounded-md transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            text-zinc-600 text-sm
            bg-white hover:bg-gray-50 border border-gray-300 shadow-sm
          `}
        >
          {btnText}
        </button>
        {after && <span className="text-zinc-700 px-2">{after}</span>}
      </div>
    </div>
  );
}
