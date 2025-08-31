
export default function ProfileStats() {
  const stats = [
    { label: 'โครงการวิจัย', value: '0'},
    { label: 'ประชุมวิชาการ', value: '0'},
    { label: 'ตีพิมพ์ทางวิชาการ', value: '0'},
    { label: 'ขอทุนเขียนตำรา', value: '0' },
    { label: 'หนังสือและตำรา', value: '0'}
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
