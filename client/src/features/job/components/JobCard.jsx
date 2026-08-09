import React from 'react';
import { Briefcase, DollarSign, MapPin, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import ApplyModal from '../../application/components/ApplyModal';
import { useNavigate } from 'react-router-dom';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

const JobCard = ({ job, canManage, onEdit, onDelete, onUpdateStatus }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'DRAFT': return 'warning';
      case 'CLOSED': return 'danger';
      case 'ARCHIVED': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.companyId?.logoUrl ? (
              <img src={job.companyId.logoUrl} alt={job.companyId.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Briefcase className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.companyId?.name}</p>
          </div>
        </div>
        {canManage && (
          <Badge variant={getStatusColor(job.status)}>
            {job.status}
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          {job.employmentType.replace('_', ' ')} • {job.workplaceType.replace('_', ' ')}
        </div>
        
        {job.location?.city && job.location?.country && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {job.location.city}, {job.location.country}
          </div>
        )}

        {(job.salaryRange?.min > 0 || job.salaryRange?.max > 0) && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            {job.salaryRange.min > 0 ? job.salaryRange.min : 0} 
            {job.salaryRange.max > 0 ? ` - ${job.salaryRange.max}` : '+'} {job.salaryRange.currency}
          </div>
        )}

        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          {job.publishedAt 
            ? `Posted ${formatTimeAgo(job.publishedAt)}`
            : `Created ${formatTimeAgo(job.createdAt)}`
          }
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requiredSkills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {skill}
          </span>
        ))}
        {job.requiredSkills?.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
            +{job.requiredSkills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
        {!canManage ? (
          <>
            <Button variant="outline" className="flex-1">
              View Details
            </Button>
            {user?.role === 'STUDENT' && job.status === 'PUBLISHED' && (
              <Button variant="primary" className="flex-1" onClick={() => setIsApplyModalOpen(true)}>
                Apply Now
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/jobs/${job._id}/applications`)}>
              View Applicants
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(job)}>
              Edit
            </Button>
            {job.status === 'DRAFT' && (
              <Button variant="primary" size="sm" className="flex-1" onClick={() => onUpdateStatus(job._id, 'PUBLISHED')}>
                Publish
              </Button>
            )}
            {job.status === 'PUBLISHED' && (
              <Button variant="warning" size="sm" className="flex-1" onClick={() => onUpdateStatus(job._id, 'CLOSED')}>
                Close
              </Button>
            )}
          </>
        )}
      </div>
      
      <ApplyModal 
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setIsApplyModalOpen(false);
          alert('Application submitted successfully!'); // We could use a toast here
        }}
      />
    </Card>
  );
};

export default JobCard;
