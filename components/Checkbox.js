export default function Checkbox({ 
  id, 
  name, 
  label, 
  checked = false,
  onChange,
  className = ''
}) {
  const isControlled = typeof onChange === 'function'
  const controlProps = isControlled
    ? { checked, onChange }
    : { defaultChecked: checked }

  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        {...controlProps}
        className={`
          h-4 w-4 text-blue-600 border-gray-300 rounded
          focus:ring-blue-500 focus:ring-2
          ${className}
        `}
      />
      <label 
        htmlFor={id} 
        className="ml-2 text-sm text-gray-700 select-none"
      >
        {label}
      </label>
    </div>
  )
}
