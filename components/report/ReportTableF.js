export default function ReportTableE() {
    const rows = [
        {
            no: 1,
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            meeting: 'Lorem ipsum Conference on Business 2024',
            authors: 'Dr. Lorem A., Dr. Ipsum B., Dr. Dolor C.',
            level: 'ระดับชาติ',
            date: '03/12/2024'
        },
        {
            no: 2,
            title: 'Sed do eiusmod tempor incididunt ut labore et dolore',
            meeting: 'International Symposium on Management',
            authors: 'A. Lorem, B. Ipsum',
            level: 'ระดับนานาชาติ',
            date: '15/01/2025'
        },
        {
            no: 3,
            title: 'Ut enim ad minim veniam, quis nostrud exercitation',
            meeting: 'Lorem Research Forum',
            authors: 'Ipsum D., Dolor E.',
            level: 'ระดับภูมิภาค',
            date: '07/02/2025'
        },
        {
            no: 4,
            title: 'Duis aute irure dolor in reprehenderit in voluptate',
            meeting: 'Business & Society Workshop',
            authors: 'Lorem F., Ipsum G., Sit H.',
            level: 'ระดับชาติ',
            date: '20/03/2025'
        },
        {
            no: 5,
            title: 'Excepteur sint occaecat cupidatat non proident',
            meeting: 'Annual Conference on Economics',
            authors: 'Dolor I., Amet J.',
            level: 'ระดับนานาชาติ',
            date: '11/04/2025'
        },
        {
            no: 6,
            title: 'Sunt in culpa qui officia deserunt mollit anim id est',
            meeting: 'Regional Research Meeting',
            authors: 'Consectetur K., Adipiscing L.',
            level: 'ระดับท้องถิ่น',
            date: '29/05/2025'
        }
    ]

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="text-center text-sm font-medium text-gray-800">รายละเอียดข้อมูลการนำเสนอผลงานทางวิชาการ</h3>
                {/* <p className="text-center text-xs text-gray-600">(ตัวอย่างข้อความ placeholder)</p> */}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">ลำดับ</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">ชื่อผลงานวิจัย</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">ชื่อการประชุม</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">ชื่อคณะผู้วิจัย</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">ระดับการประชุม</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-700 border">วัน/เดือน/ปีที่เสนอ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((r) => (
                            <tr key={r.no} className="hover:bg-gray-50 align-top">
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.no}</td>
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.title}</td>
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.meeting}</td>
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.authors}</td>
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.level}</td>
                                <td className="px-3 py-2 text-sm text-gray-900 border align-top">{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
