import Button from './Button'

export default function PublicationItem({ title, description, year, type, status }) {
  return (
    <div className="border-b border-b-gray-200 pb-4 pt-2 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{year}</span>
            {/* <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {type}
            </span>
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {status}
            </span> */}
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          <Button variant="outline" className="text-sm px-3 py-1.5">
            แก้ไขผลงาน
          </Button>
          <Button variant="primary" className="text-sm px-3 py-1.5">
            ดูเอกสาร
          </Button>
        </div>
      </div>
    </div>
  )
}
