import SectionCard from './SectionCard'
import EducationItem from './EducationItem'

export default function EducationSection() {
  const education = [
    {
      degree: "Bachelor's Degree, BA Strategic Economic",
      school: "London College of Economics, University Of London",
      period: "2020 - 2024"
    },
    {
      degree: "Master's Degree, Economic", 
      school: "MBA, University Of California",
      period: "2018 - 2020"
    },
    {
      degree: "Ph.D, Degree, Economic",
      school: "MBA, University Of Cambridge", 
      period: "2017 - 2018"
    }
  ]

  return (
    <SectionCard title="ประวัติการศึกษา">
      <div className="space-y-6">
        {education.map((item, index) => (
          <EducationItem
            key={index}
            degree={item.degree}
            school={item.school}
            period={item.period}
          />
        ))}
      </div>
    </SectionCard>
  )
}
