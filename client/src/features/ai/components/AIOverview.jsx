import React from 'react';
import ATSScoreCard from './ATSScoreCard';
import SkillGapCard from './SkillGapCard';
import JobMatchCard from './JobMatchCard';

const AIOverview = ({ jobId }) => {
  if (!jobId) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ATSScoreCard jobId={jobId} />
        <JobMatchCard jobId={jobId} />
      </div>
      <SkillGapCard jobId={jobId} />
    </div>
  );
};

export default AIOverview;
