export default function FileUploadSection() {
  const uploads = [
    {
      id: 1,
      type: 'เอกสารและหลักฐาน',
      description: 'เอกสารหลักฐานผลที่ได้',
      status: 'รอประมวลเก่า',
      fileName: 'เอกสารส่วนเพิ่มเติม.doc',
      highlight: false
    },
    {
      id: 2, 
      type: 'ข้อมูลและสรุปผลการดำเนินงาน',
      description: 'รอบการประมวลผลพื้นฐาน',
      status: 'รอดใส่ วิปะ รวมกับอื่นๆมี',
      fileName: null,
      highlight: true
    }
  ]

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">สรุปผลการดำเนินงาน</h3>
      </div>
      
      <div className="space-y-4 p-6">
        {uploads.map((upload) => (
          <div 
            key={upload.id} 
            className={`p-4 rounded-lg border ${
              upload.highlight ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${upload.highlight ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{upload.type}</div>
                  <div className="text-sm text-gray-600">{upload.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{upload.status}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {upload.fileName && (
                  <div className="text-sm text-gray-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{upload.fileName}</span>
                  </div>
                )}
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Downloads */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">ไฟล์ดาวน์โหลด</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-900">รายการการเผยแพร่ผลงาน.001.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-900">เอกสารที่มีการส่งของความข้อขีก.002.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
