export default function Button({ 
  children, 
  type = 'button', 
  onClick,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  className = '' 
}) {
  const baseClasses = `
    font-medium py-2 px-4 rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantClasses = {
    primary: `
      bg-green-600 hover:bg-green-700 text-white
      focus:ring-green-500
    `,
    secondary: `
      bg-green-500 hover:bg-green-400 text-white border border-green-400
      focus:ring-green-500
    `,
    outline: `
      bg-white hover:bg-gray-50 text-gray-700 border border-gray-300
      focus:ring-gray-500
    `
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${widthClasses}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  )
}
