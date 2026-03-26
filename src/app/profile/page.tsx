import { getCurrentProfile } from '@/lib/data'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  return <ProfileClient profile={profile} />
}
