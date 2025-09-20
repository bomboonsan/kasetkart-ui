export default function InputField({ 
	label, 
	type = 'text', 
	id, 
	name, 
	placeholder,
	required = false,
	className = '',
	wrapClassName = '',
	value,
	onChange,
	disabled = false,
}) {
	const handleChange = (e) => {
		if (typeof onChange === 'function') {
			onChange(e.target.value)
		}
	}

	return (
		<div className={`space-y-1 ${wrapClassName}`}>
			<label 
				htmlFor={id}
				className="block text-sm font-medium text-gray-700"
			>
				{label}
			</label>
			<input
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				required={required}
				value={value}
				onChange={handleChange}
				disabled={disabled}
				className={`
						text-zinc-800
					block w-full px-3 py-1.5 border border-gray-300 rounded-md
					placeholder-gray-400 focus:outline-none focus:ring-2 
					focus:ring-blue-500 focus:border-blue-500
					transition-colors duration-200
					${className}
				`}
			/>
		</div>
	)
}
