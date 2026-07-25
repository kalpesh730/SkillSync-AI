import React, { useEffect } from 'react';
import { useStudentStore } from '../../../store/studentStore';
import PageContainer from '../../../components/ui/PageContainer';
import SectionHeader from '../../../components/ui/SectionHeader';
import ProfileHeader from '../components/ProfileHeader';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import EducationList from '../components/EducationList';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

const ProfilePage = () => {
  const { profile, loading, fetchProfile, updateAvatar } = useStudentStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarUpload = async (base64String) => {
    await updateAvatar(base64String);
  };

  if (loading && !profile) {
    return <PageContainer className="flex justify-center py-12"><LoadingSpinner size="lg" /></PageContainer>;
  }

  if (!profile) return null;

  return (
    <PageContainer>
      <SectionHeader title="Student Profile" description="Manage your personal and academic information." />
      
      <ProfileCompletionCard completionPercentage={profile.profileCompletion} />
      
      <ProfileHeader profile={profile} onUploadAvatar={handleAvatarUpload} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">USN</p>
                <p className="font-medium">{profile.usn || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-medium">{profile.rollNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{profile.branch || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-medium">{profile.semester || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{profile.gender || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {profile.address?.street ? `${profile.address.street}, ` : ''}
                  {profile.address?.city ? `${profile.address.city}, ` : ''}
                  {profile.address?.state ? `${profile.address.state} ` : ''}
                  {profile.address?.country || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EducationList />
    </PageContainer>
  );
};

export default ProfilePage;
