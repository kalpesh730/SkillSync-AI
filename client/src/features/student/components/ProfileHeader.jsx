import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import AvatarComponent from './AvatarComponent';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';

const ProfileHeader = ({ profile, onUploadAvatar }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <AvatarComponent 
            profilePhoto={profile.profilePhoto} 
            firstName={profile.firstName} 
            lastName={profile.lastName}
            onUpload={onUploadAvatar}
            editable={true}
          />
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1 gap-4 flex-wrap">
                  {profile.usn && (
                    <span className="flex items-center gap-1">
                      <Badge variant="info">USN: {profile.usn}</Badge>
                    </span>
                  )}
                  {profile.branch && profile.semester && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {profile.branch}, Sem {profile.semester} {profile.section ? `(${profile.section})` : ''}
                    </span>
                  )}
                </div>
              </div>
              <Button onClick={() => navigate('/student/profile/edit')}>
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {profile.phone}
                </div>
              )}
              {profile.address && profile.address.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {profile.address.city}, {profile.address.state || profile.address.country}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
