export default function ReportTableB() {
  const reportData = [
    { discipline: 'Accounting', teaching: 19.0, research: 98.8, practice: 34.0, societal: 3.5, total: 155.3 },
    { discipline: 'Finance', teaching: 0.5, research: 119.5, practice: 8.0, societal: 0.0, total: 128.0 },
    { discipline: 'Management', teaching: 0.0, research: 167.8, practice: 51.3, societal: 1.0, total: 220.2 },
    { discipline: 'Marketing', teaching: 15.5, research: 155.8, practice: 1.8, societal: 2.0, total: 175.2 },
    { discipline: 'Technology and Operation Management', teaching: 7.0, research: 111.0, practice: 18.8, societal: 1.5, total: 138.3 },
  ]

  const totalRow = { discipline: 'Total', teaching: 42.0, research: 653.0, practice: 114.0, societal: 8.0, total: 817.0 }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-blue-100">
        <h3 className="text-center text-lg font-bold text-gray-800">Impacts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Discipline
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Teaching & Learning Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Research & Scholarly Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Practice & Community Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Societal Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 text-sm text-gray-900 border font-medium">
                  {row.discipline}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">{row.teaching}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">{row.research}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">{row.practice}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">{row.societal}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border font-bold">{row.total}</td>
              </tr>
            ))}
            
            <tr className="bg-gray-200 font-bold">
              <td className="px-4 py-3 text-sm text-gray-900 border font-bold">{totalRow.discipline}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border">{totalRow.teaching}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border">{totalRow.research}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border">{totalRow.practice}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border">{totalRow.societal}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border font-bold">{totalRow.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
