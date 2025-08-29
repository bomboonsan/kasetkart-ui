import ProfileHeader from '@/components/profile/ProfileHeader'
import EducationSection from '@/components/EducationSection'
import ResearchPublicationsSection from '@/components/ResearchPublicationsSection'

export default function Profile() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <EducationSection />
      <ResearchPublicationsSection />
    </div>
  );
}
