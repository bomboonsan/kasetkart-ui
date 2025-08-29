'use client'
import ResearchTopicsTable from '@/components/ResearchTopicsTable'
import PageHeader from '@/components/PageHeader'
import Button from "@/components/Button";
import Link from 'next/link';
import { useState } from 'react';

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  const tabs = ['ทุนโครงการวิจัย', 'ประชุมวิชาการ', 'ตีพิมพ์ทางวิชาการ', 'ขอรับทุนเขียนตำรา', 'หนังสือและตำรา'];

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
      <PageHeader title="รายการหัวข้อโครงการวิจัย" showAddButton={false} />
      <Link href="/form/create/project">
        <Button variant="primary">เพิ่มโครงการใหม่</Button>
      </Link>

      </div>
      <div className="mb-10" />

      <div>
        <ul className="flex space-x-4" role="tablist" aria-label="Tabs">
          {tabs.map((label, i) => {
            const idx = i + 1;
            const active = activeTab === idx;
            return (
              <li key={label}>
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(idx)}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* render a single table and pass the active tab so the table can adjust if needed */}
      <div>
        <ResearchTopicsTable key={activeTab} tab={activeTab} />
      </div>
    </div>
  );
}
