'use client'

import { useState } from 'react'
import FormSection from './FormSection'
import FormField from './FormField'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'
import FileUploadField from './FileUploadField'
import CheckboxGroup from './CheckboxGroup'
import RadioGroup from './RadioGroup'
import PublicationTeamTable from './PublicationTeamTable'
import Button from './Button'

export default function PublicationForm() {
  const [formData, setFormData] = useState({
    titleThai: '',
    titleEnglish: '',
    objectives: '',
    methodology: '',
    thesisType: '',
    year: '',
    doi: '',
    isbn: '',
    volume: '',
    issue: '',
    pages: '',
    quartile: '',
    indexing: [],
    category: '',
    database: '',
    attachments: [],
    keywords: '',
    citations: '',
    teamMembers: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Publication form submitted:', formData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Basic Information */}
        <FormSection title="ข้อมูลพื้นฐาน">
          <div className="space-y-4">
            <TextAreaField
              label="ชื่อเรื่อง (ไทย)"
              value={formData.titleThai}
              onChange={(value) => handleInputChange('titleThai', value)}
              rows={3}
            />

            <TextAreaField
              label="ชื่อเรื่อง (อังกฤษ)"
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange('titleEnglish', value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextAreaField
              label="วัตถุประสงค์ โครงการวิจัย/การดำเนินงาน"
              value={formData.objectives}
              onChange={(value) => handleInputChange('objectives', value)}
              rows={4}
            />
            <TextAreaField
              label="ประโยชน์ที่คาดว่าจะได้รับ โครงการวิจัย/การดำเนินงาน"
              value={formData.methodology}
              onChange={(value) => handleInputChange('methodology', value)}
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <TextAreaField
              label="รวบการค้นคว้าอิสระ นักโครงการวิจัย/การดำเนินงานหรือโครงการ"
              value={formData.researchSummary}
              onChange={(value) => handleInputChange('researchSummary', value)}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="ประเภทวิทยา"
                required
                value={formData.thesisType}
                onChange={(value) => handleInputChange('thesisType', value)}
                placeholder="กรุณาป้อนประเภทวิทยานิพนธ์"
              />
              <div /> {/* Empty div for spacing */}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="ตั้งแต่ปี"
                type="number"
                value={formData.startYear}
                onChange={(value) => handleInputChange('startYear', value)}
                placeholder="ปี พ.ศ."
              />
              <FormField
                label="ถึงปี"
                type="number"
                value={formData.endYear}
                onChange={(value) => handleInputChange('endYear', value)}
                placeholder="ปี พ.ศ."
              />
            </div>

            <FormField
              label="ปีที่ตีพิมพ์"
              type="number"
              value={formData.year}
              onChange={(value) => handleInputChange('year', value)}
              placeholder="ปี พ.ศ."
            />
          </div>
        </FormSection>

        {/* Publication Details */}
        <FormSection title="รายละเอียดการตีพิมพ์">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="DOI หรือWeblink * (ลิ้งค์ทางนิพนธ์ กรณีเป็น DOI)"
                value={formData.doi}
                onChange={(value) => handleInputChange('doi', value)}
                placeholder="https://doi.org/..."
              />
              <div /> {/* Empty div for spacing */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="ISSN (ถ้ามี วิจัย Is Journal = *)"
                value={formData.issn}
                onChange={(value) => handleInputChange('issn', value)}
              />
              <div /> {/* Empty div for spacing */}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vol./Volume
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    placeholder="เล่มที่"
                    value={formData.volume}
                    onChange={(value) => handleInputChange('volume', value)}
                  />
                  <SelectField
                    options={[
                      { value: '', label: 'เล่ม' },
                      { value: 'vol', label: 'Vol.' },
                      { value: 'volume', label: 'Volume' }
                    ]}
                    value={formData.volumeType}
                    onChange={(value) => handleInputChange('volumeType', value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ฉบับที่ Issue
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    placeholder="ฉบับที่"
                    value={formData.issue}
                    onChange={(value) => handleInputChange('issue', value)}
                  />
                  <SelectField
                    options={[
                      { value: '', label: 'ฉบับ' },
                      { value: 'issue', label: 'Issue' },
                      { value: 'no', label: 'No.' }
                    ]}
                    value={formData.issueType}
                    onChange={(value) => handleInputChange('issueType', value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  หน้า
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    placeholder="หน้า"
                    value={formData.pages}
                    onChange={(value) => handleInputChange('pages', value)}
                  />
                  <SelectField
                    options={[
                      { value: '', label: 'หน้า' },
                      { value: 'pp', label: 'pp.' },
                      { value: 'pages', label: 'Pages' }
                    ]}
                    value={formData.pagesType}
                    onChange={(value) => handleInputChange('pagesType', value)}
                  />
                </div>
              </div>
            </div>

            <FormField
              label="ครั้งที่"
              value={formData.edition}
              onChange={(value) => handleInputChange('edition', value)}
            />
          </div>
        </FormSection>

        {/* Indexing and Quality */}
        <FormSection title="การจัดทำดัชนีและคุณภาพ">
          <div className="space-y-6">
            <CheckboxGroup
              label="สถานะการขอรับการิส่งเสริม"
              options={[
                { value: 'scopus', label: 'Scopus' },
                { value: 'web-of-science', label: 'Web of Science' },
                { value: 'jci', label: 'JCR' },
                { value: 'ssrn', label: 'Social Science Research Network' }
              ]}
              value={formData.indexing}
              onChange={(value) => handleInputChange('indexing', value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="ประเภทหารอื"
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                options={[
                  { value: '', label: 'เลือกประเภท' },
                  { value: 'journal', label: 'วารสาร' },
                  { value: 'conference', label: 'การประชุม' }
                ]}
              />
              <SelectField
                label="ฐานข้อมูล"
                value={formData.database}
                onChange={(value) => handleInputChange('database', value)}
                options={[
                  { value: '', label: 'เลือกฐานข้อมูล' },
                  { value: 'scopus', label: 'Scopus' },
                  { value: 'wos', label: 'Web of Science' }
                ]}
              />
            </div>
          </div>
        </FormSection>

        {/* File Upload */}
        <FormSection title="ไฟล์แนบ">
          <div className="space-y-4">
            <FileUploadField
              label="Full-Text ผลิลงานทางวิชาการใน (เฉพาะนามสกุล วิทยานิพนธ์ ชื่อ Dep, Inc, Journal)"
              onFilesChange={(files) => handleInputChange('fullTextFiles', files)}
              accept=".pdf,.doc,.docx"
              multiple
            />

            <TextAreaField
              label="บทคัด (Thai) ประโยชน์ที่คาดว่าจะได้รับ (*)"
              value={formData.abstractThai}
              onChange={(value) => handleInputChange('abstractThai', value)}
              rows={4}
            />

            <TextAreaField
              label="บทคัด (Abstract) ประโยชน์ที่คาดว่าจะได้รับ (*)"
              value={formData.abstractEnglish}
              onChange={(value) => handleInputChange('abstractEnglish', value)}
              rows={4}
            />
          </div>
        </FormSection>

        {/* Additional Information */}
        <FormSection title="ข้อมูลเพิ่มเติม">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="text-sm text-red-800">
                  <span className="font-medium">ที่สมควรอ่าเพิ่มเติม</span> (เฉพาะ Open Access หรื่อมีความสำคัญพอ ประกอบ และ ให้มีรับความ ครับ)
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                กรอบ ชม. กรอกเอง ปริญญาเอก ยอมรับวิทยาเขตนำส่ง ประเทศ และ site project
              </label>
            </div>

            <div className="space-y-4">
              <FormField
                label="รายการอื่น"
                value={formData.otherDetails}
                onChange={(value) => handleInputChange('otherDetails', value)}
                placeholder="กรุณาระบุรายการอื่น"
              />

              <FormField
                label="รายสารอื่น"
                value={formData.otherJournals}
                onChange={(value) => handleInputChange('otherJournals', value)}
              />

              <FormField
                label="ที่ตั้งสำนักงาน"
                value={formData.officeLocation}
                onChange={(value) => handleInputChange('officeLocation', value)}
              />

              <FormField
                label="ที่อยู่ครอบครับ"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
              />
            </div>
          </div>
        </FormSection>

        {/* Team Table */}
        <FormSection title="นักวิจัย/ผู้ร่วมวิจัย ของผลงานนี้">
          <PublicationTeamTable />
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            Back
          </Button>
          <Button variant="secondary" type="button">
            Save Draft
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>

      </form>
    </div>
  )
}
