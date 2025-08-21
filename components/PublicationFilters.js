'use client'

import { useState } from 'react'

export default function PublicationFilters() {
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด')

  const filters = ["ทั้งหมด", "สิ่งตีพิมพ์", "ประชุมวิชาการ", "หนังสือและตำรา"];

  return (
    <div className="flex flex-wrap gap-5">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-2 py-2 text-base font-medium transition-colors ${
            activeFilter === filter
              ? "text-primary  border-b-2 border-b-primary"
              : "text-gray-700 hover:text-gray-600 border-b-2 border-b-white"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
