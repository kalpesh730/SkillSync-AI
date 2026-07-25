import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../../store/studentStore';
import PageContainer from '../../../components/ui/PageContainer';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import { Card, CardContent } from '../../../components/ui/Card';
import ProfileForm from '../components/ProfileForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { profile, loading, fetchProfile, updateProfile } = useStudentStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const handleSubmit = async (formData) => {
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success('Profile updated successfully');
      navigate('/student/profile');
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  if (loading && !profile) {
    return <PageContainer className="flex justify-center py-12"><LoadingSpinner size="lg" /></PageContainer>;
  }

  return (
    <PageContainer>
      <Breadcrumb 
        items={[
          { name: 'Profile', href: '/student/profile' },
          { name: 'Edit Profile' }
        ]} 
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500">Update your personal and academic information.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProfileForm profile={profile} onSubmit={handleSubmit} isLoading={loading} />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default EditProfilePage;
