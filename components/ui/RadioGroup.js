export default function RadioGroup({ 
	label, 
	options = [], 
	value, 
	onChange, 
	name,
	className = '' 
}) {
	return (
		<div className={`space-y-3 ${className}`}>
			<label className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<div className="space-y-2">
				{options.map((option) => (
					<div key={option.value} className="flex items-center">
						<input
							type="radio"
							id={option.value}
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={(e) => onChange(e.target.value)}
							className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
						/>
						<label 
							htmlFor={option.value}
							className="ml-3 text-sm text-gray-700 select-none cursor-pointer"
						>
							{option.label}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}
