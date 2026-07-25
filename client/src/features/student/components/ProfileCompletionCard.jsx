import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';

const ProfileCompletionCard = ({ completionPercentage }) => {
  let colorClass = 'bg-red-500';
  if (completionPercentage >= 50) colorClass = 'bg-yellow-500';
  if (completionPercentage >= 80) colorClass = 'bg-green-500';
  if (completionPercentage === 100) colorClass = 'bg-blue-600';

  return (
    <Card className="mb-6 bg-blue-50/50 border-blue-100">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Profile Completion</h3>
          <span className="font-bold text-lg text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${completionPercentage}%` }}></div>
        </div>
        {completionPercentage < 100 && (
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to unlock AI-powered job matches and roadmap generation.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
