import React, { useEffect } from 'react';
import { useAIStore } from '../../../store/aiStore';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Zap } from 'lucide-react';

const JobMatchCard = ({ jobId }) => {
  const { jobMatch, loadingJobMatch, error, fetchJobMatch } = useAIStore();

  useEffect(() => {
    if (jobId) {
      fetchJobMatch(jobId);
    }
  }, [jobId, fetchJobMatch]);

  if (loadingJobMatch) {
    return (
      <Card className="flex justify-center items-center h-48">
        <LoadingSpinner />
        <span className="ml-3 text-gray-500">Calculating Job Match...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4 text-center">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchJobMatch(jobId)}>
          Retry Analysis
        </Button>
      </Card>
    );
  }

  if (!jobMatch) return null;

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Job Match Assessment
        </h3>
        <Badge variant={jobMatch.matchScore > 75 ? 'success' : jobMatch.matchScore > 50 ? 'warning' : 'danger'}>
          {jobMatch.matchScore}% Match
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Recommendation</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
            {jobMatch.recommendation}
          </p>
        </div>

        {jobMatch.reasons.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Why you&apos;re a fit</h4>
            <ul className="space-y-1">
              {jobMatch.reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2">✓</span> {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {jobMatch.concerns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Potential Concerns</h4>
            <ul className="space-y-1">
              {jobMatch.concerns.map((concern, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-red-500 mr-2">!</span> {concern}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default JobMatchCard;
