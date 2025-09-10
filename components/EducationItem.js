export default function EducationItem({ degree, school, period, faculty }) {
  return (
    <div className="border-l-4 border-gray-200 pl-4">
      <h3 className="font-semibold text-gray-900 mb-1">{degree}</h3>
      <p className="text-gray-600 mb-1">{school}</p>
      {faculty && <p className="text-gray-600 mb-1">{faculty}</p>}
      <p className="text-sm text-gray-500">{period}</p>
    </div>
  )
}
