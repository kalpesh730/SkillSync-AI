import React from 'react';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Briefcase, Building2, MapPin, Calendar } from 'lucide-react';
import { useApplicationStore } from '../../../store/applicationStore';

const ApplicationCard = ({ application, onWithdraw }) => {
  const { loading } = useApplicationStore();

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'secondary';
      case 'SCREENING': return 'primary';
      case 'SHORTLISTED': return 'warning';
      case 'INTERVIEW': return 'primary';
      case 'SELECTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'WITHDRAWN': return 'secondary';
      default: return 'primary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const canWithdraw = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW'].includes(application.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {application.companyId?.logoUrl ? (
              <img src={application.companyId.logoUrl} alt={application.companyId.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{application.jobId?.title}</h3>
            <p className="text-sm text-gray-500">{application.companyId?.name}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(application.status)}>
          {application.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          {application.jobId?.employmentType?.replace('_', ' ')} • {application.jobId?.workplaceType?.replace('_', ' ')}
        </div>
        
        {application.jobId?.location?.city && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {application.jobId.location.city}
          </div>
        )}

        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Applied on {formatDate(application.appliedAt)}
        </div>
        
        {application.interviewAt && (
          <div className="flex items-center text-primary-600 font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            Interview: {formatDate(application.interviewAt)}
          </div>
        )}
      </div>

      <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100 justify-end">
        {canWithdraw && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Are you sure you want to withdraw this application?')) {
                onWithdraw(application._id);
              }
            }}
            disabled={loading}
          >
            Withdraw Application
          </Button>
        )}
        <Button variant="primary" size="sm">
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;
