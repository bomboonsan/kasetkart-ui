export default function ReportTableC() {
  const reportData = [
    {
      discipline: "Accounting",
      tciTier1: 22.5,
      tciTier2: 6.0,
      nonListedTci: 0.0,
      totalNational: 28.5,
      aci: 11.0,
      totalScopus: 15.3,
      totalWebOfScience: 5,
      totalAbdc: 4,
      totalAjg: 4.5,
      otherPjr: 3,
      totalInternational: 42.8,
      totalPublications: 71.3
    },
    {
      discipline: "Finance",
      tciTier1: 13.5,
      tciTier2: 10.5,
      nonListedTci: 0.0,
      totalNational: 24.0,
      aci: 2.0,
      totalScopus: 17.0,
      totalWebOfScience: 14,
      totalAbdc: 7,
      totalAjg: 7,
      otherPjr: 1,
      totalInternational: 48.0,
      totalPublications: 72.0
    },
    {
      discipline: "Management",
      tciTier1: 17.0,
      tciTier2: 55.3,
      nonListedTci: 2.0,
      totalNational: 74.3,
      aci: 3.3,
      totalScopus: 22.7,
      totalWebOfScience: 12,
      totalAbdc: 7,
      totalAjg: 5,
      otherPjr: 4,
      totalInternational: 54.0,
      totalPublications: 128.3
    },
    {
      discipline: "Marketing",
      tciTier1: 10.7,
      tciTier2: 24.5,
      nonListedTci: 1.0,
      totalNational: 36.2,
      aci: 6.3,
      totalScopus: 49.5,
      totalWebOfScience: 22,
      totalAbdc: 5,
      totalAjg: 6.5,
      otherPjr: 10,
      totalInternational: 99.3,
      totalPublications: 135.5
    },
    {
      discipline: "Technology and Operation Management",
      tciTier1: 38.3,
      tciTier2: 18.7,
      nonListedTci: 0.0,
      totalNational: 57.0,
      aci: 21.3,
      totalScopus: 12.5,
      totalWebOfScience: 8,
      totalAbdc: 3,
      totalAjg: 4,
      otherPjr: 1,
      totalInternational: 49.8,
      totalPublications: 106.8
    }
  ]

  const totalRow = {
    discipline: "Total",
    tciTier1: 102.0,
    tciTier2: 115.0,
    nonListedTci: 3.0,
    totalNational: 220.0,
    aci: 44.0,
    totalScopus: 117.0,
    totalWebOfScience: 61.0,
    totalAbdc: 26.0,
    totalAjg: 27.0,
    otherPjr: 19.0,
    totalInternational: 294.0,
    totalPublications: 514.0
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border"
                rowSpan="2"
              >
                Discipline
              </th>
              <th
                className="bg-green-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border"
                colSpan="4"
              >
                National Publications
              </th>
              <th
                className="bg-pink-200 px-4 py-3 text-center text-sm font-bold text-gray-800 border"
                colSpan="7"
              >
                International Publications
              </th>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-sm font-bold text-gray-800 border"
                rowSpan="2"
              >
                Total Publications<br/>(National + International)<br/>with multiple count
              </th>
            </tr>
            <tr>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                TCI<br/>(Tier 1)
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                TCI<br/>(Tier 2)
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Non-listed<br/>on TCI
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total<br/>National<br/>Publications
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                ACI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total Scopus
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total<br/>Web of Science
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total<br/>ABDC
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total<br/>AJG
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Other PJR
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-bold text-gray-800 border">
                Total<br/>International<br/>Publications
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 text-sm text-gray-900 border font-medium">
                  {row.discipline}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.tciTier1}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.tciTier2}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.nonListedTci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border font-semibold">{row.totalNational}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.aci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.totalScopus}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.totalWebOfScience}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.totalAbdc}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.totalAjg}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border">{row.otherPjr}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border font-semibold">{row.totalInternational}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border font-bold">{row.totalPublications}</td>
              </tr>
            ))}
            
            <tr className="bg-gray-200 font-bold">
              <td className="px-4 py-3 text-sm text-gray-900 border font-bold">{totalRow.discipline}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.tciTier1}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.tciTier2}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.nonListedTci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border font-bold">{totalRow.totalNational}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.aci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.totalScopus}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.totalWebOfScience}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.totalAbdc}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.totalAjg}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border">{totalRow.otherPjr}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border font-bold">{totalRow.totalInternational}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border font-bold">{totalRow.totalPublications}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
