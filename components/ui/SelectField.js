"use client"

export default function SelectField({ 
	label, 
	value, 
	onChange, 
	options = [],
	required = false,
	disabled = false,
	className = '' 
}) {
	return (
		<div className="space-y-1 custom-select-wrapper">
			<label className="block text-sm font-medium text-gray-700">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			<select
				value={value}
				onChange={(e) => onChange && onChange(e.target.value)}
				required={required}
				disabled={disabled}
							className={`
						text-zinc-700
					block w-full px-3 py-1.5 border border-gray-300 rounded-md
					bg-white focus:outline-none focus:ring-2 
					focus:ring-blue-500 focus:border-blue-500
					transition-colors duration-200
					custom-select
					${className}
				`}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<span className="custom-arrow"></span>
		</div>
	)
}
