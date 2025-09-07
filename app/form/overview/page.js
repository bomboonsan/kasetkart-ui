"use client"

import Link from 'next/link'
import Button from '@/components/Button'
import PageHeader from '@/components/PageHeader'

export default function MyOverviewPage() {
  const sections = [
    {
      title: 'โครงการวิจัย',
      description: 'จัดการโครงการวิจัยและข้อมูลการวิจัย',
      href: '/form/projects',
      icon: '🔬',
      createHref: '/form/create/project'
    },
    {
      title: 'ทุนโครงการ',
      description: 'จัดการข้อมูลทุนสนับสนุนโครงการ',
      href: '/form/funds',
      icon: '💰',
      createHref: '/form/create/funding'
    },
    {
      title: 'ประชุมวิชาการ',
      description: 'จัดการข้อมูลการเข้าร่วมและนำเสนอในที่ประชุม',
      href: '/form/conferents',
      icon: '🎤',
      createHref: '/form/create/conference'
    },
    {
      title: 'ตีพิมพ์ทางวิชาการ',
      description: 'จัดการข้อมูลบทความและงานตีพิมพ์',
      href: '/form/publications',
      icon: '📄',
      createHref: '/form/create/publication'
    },
    {
      title: 'หนังสือและตำรา',
      description: 'จัดการข้อมูลหนังสือและตำราที่เขียน',
      href: '/form/books',
      icon: '📚',
      createHref: '/form/create/book'
    }
  ]

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <PageHeader title="โครงการและผลงานของฉัน" showAddButton={false} />
        <Link href="/form/create/project">
          <Button variant="primary">เพิ่มโครงการใหม่</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.href} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <Link href={section.href} className="block p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{section.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">ดูรายการ →</span>
                <Link 
                  href={section.createHref}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  เพิ่มใหม่
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

