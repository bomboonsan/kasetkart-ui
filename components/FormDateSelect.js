export default function FormDateSelect({ title, children }) {
  const day = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const year = Array.from({ length: 10 }, (_, i) => 2568 + i);
  return (
    <div className="flex items-center gap-x-4">
      <p className="text-zinc-700 font-medium">{title}</p>
      <div className="space-x-2">
        <label className="text-zinc-700">วันที่</label>
        <select className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2">
          {day.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="space-x-2">
        <label className="text-zinc-700">เดือน</label>
        <select className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2">
          {monthThai.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="space-x-2">
        <label className="text-zinc-700">ปี</label>
        <select className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2">
          {year.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
