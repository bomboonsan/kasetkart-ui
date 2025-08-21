import SectionCard from './SectionCard'
import PublicationFilters from './PublicationFilters'
import PublicationItem from './PublicationItem'

export default function ResearchPublicationsSection() {
  const publications = [
    {
      title: "The Adaptation of Thai Entrepreneurs to E-commerce Market after COVID-19 Crisis",
      description: "การปรับตัวของผู้ประกอบการไทยสู่ตลาดการค้าอิเล็กทรอนิกส์ภายหลังสถานการณ์ โควิด-19 นะ คน ทำแซม ชลอ สอนหรือเทส เข็ยอม มาหรือไช่",
      year: "2019",
      type: "บทความวิชาการ",
      status: "ตีพิมพ์แล้ว"
    },
    {
      title: "The Adaptation of Thai Entrepreneurs to E-commerce Market after COVID-19 Crisis", 
      description: "การปรับตัวของผู้ประกอบการไทยสู่ตลาดการค้าอิเล็กทรอนิกส์ภายหลังสถานการณ์ โควิด-19 นะ คน ทำแซม ชลอ สอนหรือเทส เข็ยอม มาหรือไช่",
      year: "2019",
      type: "บทความวิชาการ", 
      status: "ตีพิมพ์แล้ว"
    },
    {
      title: "The Adaptation of Thai Entrepreneurs to E-commerce Market after COVID-19 Crisis",
      description: "การปรับตัวของผู้ประกอบการไทยสู่ตลาดการค้าอิเล็กทรอนิกส์ภายหลังสถานการณ์ โควิด-19 นะ คน ทำแซม ชลอ สอนหรือเทส เข็ยอม มาหรือไช่", 
      year: "2019",
      type: "บทความวิชาการ",
      status: "ตีพิมพ์แล้ว"
    },
    {
      title: "The Adaptation of Thai Entrepreneurs to E-commerce Market after COVID-19 Crisis",
      description: "การปรับตัวของผู้ประกอบการไทยสู่ตลาดการค้าอิเล็กทรอนิกส์ภายหลังสถานการณ์ โควิด-19 นะ คน ทำแซม ชลอ สอนหรือเทส เข็ยอม มาหรือไช่",
      year: "2019", 
      type: "บทความวิชาการ",
      status: "ตีพิมพ์แล้ว"
    },
    {
      title: "The Adaptation of Thai Entrepreneurs to E-commerce Market after COVID-19 Crisis",
      description: "การปรับตัวของผู้ประกอบการไทยสู่ตลาดการค้าอิเล็กทรอนิกส์ภายหลังสถานการณ์ โควิด-19 นะ คน ทำแซม ชลอ สอนหรือเทส เข็ยอม มาหรือไช่",
      year: "2019",
      type: "บทความวิชาการ", 
      status: "ตีพิมพ์แล้ว"
    }
  ]

  return (
    <SectionCard title="ผลงานการการเขียนตามประเภท">
      <div className="space-y-6">
        <PublicationFilters />
        <div className="space-y-4">
          {publications.map((publication, index) => (
            <PublicationItem
              key={index}
              title={publication.title}
              description={publication.description}
              year={publication.year}
              type={publication.type}
              status={publication.status}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
