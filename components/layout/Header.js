export default function Header({ title = "งานของส่วนราชการของ" }) {
	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-gray-800">{title}</h1>
				{/* User Profile */}
				<div className="flex items-center space-x-3"></div>
			</div>
		</header>
	);
}
