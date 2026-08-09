import React from 'react';
import { Building2, Globe, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const CompanyCard = ({ company, onEdit, onDelete, canManage }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
        <Badge variant={company.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
          {company.verificationStatus}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        {company.location?.city && company.location?.country && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {company.location.city}, {company.location.country}
          </div>
        )}
        {company.website && (
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 underline">
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {canManage && (
        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(company)}>
            Edit Details
          </Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(company._id)}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CompanyCard;
