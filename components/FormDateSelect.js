"use client"

import { useEffect, useMemo, useState } from 'react'

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
  ]

const monthMap = Object.fromEntries(monthThai.map((m, i) => [m, i + 1]))

export default function FormDateSelect({ title, value, onChange, noDay = false }) {
  const dayOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), [])
  const yearOptions = useMemo(() => Array.from({ length: 30 }, (_, i) => 2560 + i), [])

  const [day, setDay] = useState(1)
  const [month, setMonth] = useState(monthThai[0])
  const [yearTh, setYearTh] = useState(2568)

  useEffect(() => {
    if (!value) return
    // Expect value as YYYY-MM-DD (Gregorian)
    const [y, m, d] = value.split('-').map(v => parseInt(v))
    if (y && m && d) {
      setDay(d)
      setMonth(monthThai[m - 1])
      setYearTh(y + 543)
    }
  }, [value])

  useEffect(() => {
    if (!onChange) return
    const mNum = monthMap[month] || 1
    const gYear = Math.max(1900, (parseInt(yearTh) || 2568) - 543)
    const mm = String(mNum).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${gYear}-${mm}-${dd}`)
  }, [day, month, yearTh])

  return (
    <div className="flex items-center gap-x-4">
      <p className="text-zinc-700 font-medium">{title}</p>
      {
        !noDay && (<>
        <div className="space-x-2">
          <label className="text-zinc-700">วันที่</label>
          <select
            className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2"
            value={day}
            onChange={e => setDay(parseInt(e.target.value))}
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        </>)
      
      }
      <div className="space-x-2">
        <label className="text-zinc-700">เดือน</label>
        <select
          className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2"
          value={month}
          onChange={e => setMonth(e.target.value)}
        >
          {monthThai.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="space-x-2">
        <label className="text-zinc-700">ปี</label>
        <select
          className="text-zinc-800 border border-gray-300 rounded-md px-3 py-2"
          value={yearTh}
          onChange={e => setYearTh(parseInt(e.target.value))}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
