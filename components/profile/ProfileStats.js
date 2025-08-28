
export default function ProfileStats() {
  const stats = [
    { label: 'บทความที่ตีพิมพ์', value: '12'},
    { label: 'ผลงานวิจัย', value: '8'},
    { label: 'โครงการที่เข้าร่วม', value: '6'},
    { label: 'รางวัลที่ได้รับ', value: '3'}
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50/50 p-6 rounded-b-lg border-t border-t-gray-200">
      {stats.map((stat, index) => (
        <p key={index} className="text-gray-900 text-center space-x-1.5">
          <span className="text-primary text-xl font-bold">{stat.value}</span>
          <span className="text-lg">{stat.label}</span>
        </p>
      ))}
    </div>
  );
}
