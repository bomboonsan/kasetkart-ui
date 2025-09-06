'use client'

import { useState, useEffect } from 'react'
import ProfileImageUpload from './ProfileImageUpload'
import FormField from './FormField'
import SelectField from './SelectField'
import Button from './Button'
import { profileAPI, orgAPI } from '../lib/api' // Import API functions

export default function GeneralInfoTab() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    // Profile fields
    firstNameTH: '',
    lastNameTH: '',
    firstNameEN: '',
    lastNameEN: '',
    academicPosition: '',
    telephoneNo: '',
    // User fields
    email: '',
    department: null, // Will store the department ID
  });
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [userResponse, departmentsResponse] = await Promise.all([
          profileAPI.getMyProfile(),
          orgAPI.getDepartments()
        ]);

        if (userResponse) {
          setUser(userResponse);
          setFormData({
            firstNameTH: userResponse.profile?.firstNameTH || '',
            lastNameTH: userResponse.profile?.lastNameTH || '',
            firstNameEN: userResponse.profile?.firstNameEN || '',
            lastNameEN: userResponse.profile?.lastNameEN || '',
            academicPosition: userResponse.profile?.academicPosition || '',
            telephoneNo: userResponse.profile?.telephoneNo || '',
            email: userResponse.email || '',
            department: userResponse.department?.id || null,
          });
        }

        if (departmentsResponse && Array.isArray(departmentsResponse.data)) {
          const departmentOptions = departmentsResponse.data.map(dep => ({
            value: dep.id,
            label: dep.attributes.name,
          }));
          setDepartments(departmentOptions);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || !user.profile) {
      console.error("User or profile data is missing.");
      return;
    }

    try {
      setIsLoading(true);
      const profileId = user.profile.id;
      
      // 1. Update Profile Data
      const profileDataToUpdate = {
        firstNameTH: formData.firstNameTH,
        lastNameTH: formData.lastNameTH,
        firstNameEN: formData.firstNameEN,
        lastNameEN: formData.lastNameEN,
        academicPosition: formData.academicPosition,
        telephoneNo: formData.telephoneNo,
      };
      await profileAPI.updateProfileData(profileId, profileDataToUpdate);

      // 2. Update User Data (department and email)
      const userDataToUpdate = {
        email: formData.email,
        department: formData.department,
      };
      await profileAPI.updateProfile(user.id, userDataToUpdate);

      alert("บันทึกข้อมูลสำเร็จ!");
      setError(null);
    } catch (err) {
      console.error("Failed to save profile data:", err);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to initial state from user data
    if (user) {
      setFormData({
        firstNameTH: user.profile?.firstNameTH || '',
        lastNameTH: user.profile?.lastNameTH || '',
        firstNameEN: user.profile?.firstNameEN || '',
        lastNameEN: user.profile?.lastNameEN || '',
        academicPosition: user.profile?.academicPosition || '',
        telephoneNo: user.profile?.telephoneNo || '',
        email: user.email || '',
        department: user.department?.id || null,
      });
    }
  };

  if (isLoading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="flex-shrink-0">
          <ProfileImageUpload />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="ชื่อ"
              value={formData.firstNameTH}
              onChange={(value) => handleInputChange('firstNameTH', value)}
              placeholder="กรุณาระบุชื่อ"
            />
            <FormField
              label="นามสกุล"
              value={formData.lastNameTH}
              onChange={(value) => handleInputChange('lastNameTH', value)}
              placeholder="กรุณาระบุนามสกุล"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="ชื่อ (ภาษาอังกฤษ)"
              value={formData.firstNameEN}
              onChange={(value) => handleInputChange('firstNameEN', value)}
              placeholder="First Name"
            />
            <FormField
              label="นามสกุล (ภาษาอังกฤษ)"
              value={formData.lastNameEN}
              onChange={(value) => handleInputChange('lastNameEN', value)}
              placeholder="Last Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="อีเมล"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="กรุณาระบุอีเมล"
            />
            <FormField
              label="เบอร์โทร"
              value={formData.telephoneNo}
              onChange={(value) => handleInputChange('telephoneNo', value)}
              placeholder="กรุณาระบุเบอร์โทร"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">ข้อมูลการทำงาน</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="ตำแหน่งงาน"
            value={formData.academicPosition}
            onChange={(value) => handleInputChange('academicPosition', value)}
            placeholder="กรุณาระบุตำแหน่งงาน"
          />
          <SelectField
            label="แผนกที่สังกัด"
            value={formData.department}
            onChange={(value) => handleInputChange('department', value)}
            options={departments}
            placeholder="เลือกแผนก"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          ยกเลิก
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
      </div>
    </div>
  )
}