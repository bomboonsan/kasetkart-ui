import Image from 'next/image';

export default function ProfileImageUpload() {
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <Image 
              src={imagePreview} 
              alt="Profile preview" 
              width={96} 
              height={96} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 text-white text-2xl font-bold flex items-center justify-center rounded-full">
              ธี
            </div>
          )}
        </div>
        
        {/* Camera icon overlay */}
        <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">อัปโหลดรูปภาพ</p>
        <p className="text-xs text-gray-500">JPG, PNG ขนาดไม่เกิน 2MB</p>
      </div>
    </div>
  )
}
