import Image from 'next/image'
import Button from './Button'
import ProfileStats from "@/components/ProfileStats";
import Link from 'next/link';

export default function ProfileHeader() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-primary text-white text-2xl font-bold flex items-center justify-center rounded-full">
                T
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              ธีรวิชญ์ วงศเพียร
            </h1>
            <p className="text-lg text-gray-600 mb-2">Thirarut Worapishet</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>ผู้ช่วยศาสตราจารย์ ดอกเตอร์</p>
              <p>ภาค การเงิน</p>
              <p>fbusths@ku.ac.th</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link href="/dashboard/profile/edit">
              <Button variant="outline">Edit profile</Button>
            </Link>
          </div>
        </div>
      </div>
      <ProfileStats />
    </div>
  );
}
